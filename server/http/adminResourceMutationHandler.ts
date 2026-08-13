import { CopyObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { resourceDeleteSchema, resourceRenameSchema } from '../../src/contracts/adminOperations.ts'
import {
  AdminAuthenticationError,
  AdminAuthorizationError,
  authenticateAdminRequest,
  type AdminAuthenticationDependencies,
} from '../auth/authenticateAdminRequest.ts'
import { getR2Config } from '../config/r2.ts'
import type { R2Config } from '../config/r2.ts'
import { createR2Client } from '../repository/r2Client.ts'
import { isR2NotFound, isR2PreconditionFailed } from '../repository/r2Errors.ts'
import { parseResourceObjectKey } from '../repository/parseResourceObjectKey.ts'
import { readRepositoryStructure } from '../repository/repositoryStructureStore.ts'
import { recordAuditEvent } from '../security/auditLog.ts'

const headers = { 'cache-control': 'private, no-store', 'content-type': 'application/json; charset=utf-8' }
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers })

type ResourceMutationDependencies = AdminAuthenticationDependencies & {
  audit?: typeof recordAuditEvent
  config?: R2Config
  structure?: readonly {
    id: string
    title: string
    categories: readonly { id: string; title: string }[]
  }[]
  send?: (command: HeadObjectCommand | CopyObjectCommand | DeleteObjectCommand) => Promise<unknown>
}

function addDestinationMustNotExist(command: CopyObjectCommand) {
  command.middlewareStack.add(
    (next) => async (arguments_) => {
      const request = arguments_.request as { headers?: Record<string, string> }
      if (request.headers) request.headers['cf-copy-destination-if-none-match'] = '*'
      return next(arguments_)
    },
    { step: 'build', name: 'r2CopyDestinationMustNotExist' },
  )
  return command
}

function authenticationFailure(error: unknown) {
  if (error instanceof AdminAuthorizationError) {
    return json({ error: { code: 'FORBIDDEN', message: error.message } }, 403)
  }
  return json({ error: { code: 'UNAUTHORIZED', message: error instanceof AdminAuthenticationError ? error.message : 'Authentication is required.' } }, 401)
}

export async function handleAdminResourceMutationRequest(
  request: Request,
  dependencies: ResourceMutationDependencies = {},
) {
  let identity
  try {
    identity = await authenticateAdminRequest(request, dependencies)
  } catch (error) {
    return authenticationFailure(error)
  }

  let payload: unknown
  try { payload = await request.json() } catch { return json({ error: { code: 'INVALID_REQUEST', message: 'The request body must be valid JSON.' } }, 400) }
  const config = dependencies.config ?? getR2Config(dependencies.environment)
  const client = createR2Client(config)
  const send = dependencies.send ?? ((command) => {
    if (command instanceof HeadObjectCommand) return client.send(command)
    if (command instanceof CopyObjectCommand) return client.send(command)
    return client.send(command)
  })
  const audit = dependencies.audit ?? recordAuditEvent

  try {
    const structure = dependencies.structure ?? await readRepositoryStructure(dependencies.environment)
    if (request.method === 'DELETE') {
      const result = resourceDeleteSchema.safeParse(payload)
      if (!result.success) return json({ error: { code: 'INVALID_REQUEST', message: 'The deletion request is invalid.' } }, 400)
      const parsed = parseResourceObjectKey(result.data.key, structure)
      if (parsed.filename !== result.data.confirmation) return json({ error: { code: 'CONFIRMATION_MISMATCH', message: 'The deletion confirmation does not match this file.' } }, 400)
      await audit({ action: 'resource.deleted', actor: identity, target: parsed.key, outcome: 'attempted' }, dependencies.environment)
      await send(new DeleteObjectCommand({ Bucket: config.bucketName, Key: parsed.key }))
      return json({ data: { key: parsed.key } })
    }

    if (request.method === 'PATCH') {
      const result = resourceRenameSchema.safeParse(payload)
      if (!result.success) return json({ error: { code: 'INVALID_REQUEST', message: 'The rename request is invalid.' } }, 400)
      const parsed = parseResourceObjectKey(result.data.key, structure)
      const extension = parsed.filename.split('.').pop()?.toLowerCase()
      if (result.data.filename.split('.').pop()?.toLowerCase() !== extension) return json({ error: { code: 'INVALID_EXTENSION', message: 'Renaming cannot change the file type.' } }, 400)
      const targetKey = parsed.categoryId
        ? `${parsed.sectionId}/${parsed.categoryId}/${parsed.year}/${result.data.filename}`
        : `${parsed.sectionId}/${parsed.year}/${result.data.filename}`

      try {
        await send(new HeadObjectCommand({ Bucket: config.bucketName, Key: targetKey }))
        return json({ error: { code: 'DUPLICATE_RESOURCE', message: 'A resource with that filename already exists.' } }, 409)
      } catch (error) {
        if (!isR2NotFound(error)) throw error
      }

      await audit({
        action: 'resource.renamed',
        actor: identity,
        target: parsed.key,
        outcome: 'attempted',
        details: { destinationKey: targetKey },
      }, dependencies.environment)

      const copy = addDestinationMustNotExist(new CopyObjectCommand({
        Bucket: config.bucketName,
        CopySource: `${config.bucketName}/${encodeURIComponent(parsed.key).replace(/%2F/gu, '/')}`,
        Key: targetKey,
      }))
      try {
        await send(copy)
      } catch (error) {
        if (isR2PreconditionFailed(error)) {
          return json({ error: { code: 'DUPLICATE_RESOURCE', message: 'A resource with that filename was created before the rename completed.' } }, 409)
        }
        throw error
      }
      await send(new DeleteObjectCommand({ Bucket: config.bucketName, Key: parsed.key }))
      return json({ data: { key: targetKey } })
    }

    return json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Only PATCH and DELETE are supported.' } }, 405)
  } catch {
    return json({ error: { code: 'RESOURCE_OPERATION_FAILED', message: 'The repository operation could not be completed.' } }, 500)
  }
}
