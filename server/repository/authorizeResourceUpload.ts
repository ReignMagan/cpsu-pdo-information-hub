import { HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { resourceFileDefinitions, type ResourceFileExtension } from '../../src/contracts/resource.ts'
import type { ResourceUploadRequest } from '../../src/contracts/resourceUpload.ts'
import { getR2Config, type R2Config } from '../config/r2.ts'
import { createR2Client } from './r2Client.ts'
import { readRepositoryStructure } from './repositoryStructureStore.ts'
import { repositorySections } from '../../src/config/repository.ts'
import type { ManagedSection } from '../../src/contracts/repositoryStructure.ts'

const uploadExpirationSeconds = 5 * 60

export class InvalidResourceUploadError extends Error {}
export class DuplicateResourceError extends Error {}

type UploadDependencies = {
  environment?: NodeJS.ProcessEnv
  config?: R2Config
  objectExists?: (bucket: string, key: string) => Promise<boolean>
  createUploadUrl?: (config: R2Config, bucket: string, key: string, mimeType: string, fileSize: number) => Promise<string>
  structure?: readonly ManagedSection[]
}

function validateFilename(filename: string) {
  const extension = filename.split('.').pop()?.toLowerCase() as ResourceFileExtension | undefined
  const definition = extension ? resourceFileDefinitions[extension] : undefined
  if (!extension || !definition) throw new InvalidResourceUploadError('The selected file type is unsupported.')
  return { filename, definition }
}

export async function authorizeResourceUpload(input: ResourceUploadRequest, dependencies: UploadDependencies = {}) {
  const structure = dependencies.structure ?? (dependencies.environment ? await readRepositoryStructure(dependencies.environment) : repositorySections)
  const section = structure.find((item) => item.id === input.sectionId)
  if (!section) {
    throw new InvalidResourceUploadError('The selected repository section is unavailable.')
  }
  if (input.categoryId && !section.categories.some((category) => category.id === input.categoryId)) {
    throw new InvalidResourceUploadError('The selected category does not belong to the repository section.')
  }
  const validated = validateFilename(input.filename)
  if (validated.definition.mimeType !== input.mimeType) {
    throw new InvalidResourceUploadError('The file MIME type does not match its extension.')
  }

  const config = dependencies.config ?? getR2Config(dependencies.environment)
  const key = input.categoryId
    ? `${input.sectionId}/${input.categoryId}/${input.year}/${validated.filename}`
    : `${input.sectionId}/${input.year}/${validated.filename}`
  const client = createR2Client(config)
  const objectExists = dependencies.objectExists ?? (async (bucket, objectKey) => {
    try { await client.send(new HeadObjectCommand({ Bucket: bucket, Key: objectKey })); return true }
    catch (error) {
      const status = typeof error === 'object' && error !== null && '$metadata' in error
        ? (error.$metadata as { httpStatusCode?: number }).httpStatusCode : undefined
      if (status === 404) return false
      throw error
    }
  })
  if (await objectExists(config.bucketName, key)) throw new DuplicateResourceError('A resource with this repository key already exists.')

  const createUploadUrl = dependencies.createUploadUrl ?? (async (_config, bucket, objectKey, mimeType, fileSize) =>
    getSignedUrl(client, new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      ContentType: mimeType,
      ContentLength: fileSize,
      IfNoneMatch: '*',
    }), { expiresIn: uploadExpirationSeconds }))
  return {
    key,
    uploadUrl: await createUploadUrl(config, config.bucketName, key, input.mimeType, input.fileSize),
    expiresInSeconds: uploadExpirationSeconds,
    headers: { 'content-type': input.mimeType, 'if-none-match': '*' },
  }
}
