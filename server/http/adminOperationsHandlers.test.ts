import { CopyObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import type { Auth, DecodedIdToken, UserRecord } from 'firebase-admin/auth'
import { describe, expect, it, vi } from 'vitest'
import { repositorySections } from '../../src/config/repository.ts'
import type { R2Config } from '../config/r2.ts'
import { handleAdminResourceMutationRequest } from './adminResourceMutationHandler.ts'
import { handleAdminUsersRequest } from './adminUsersHandler.ts'

const administrator = { uid: 'admin-1', email: 'admin@cpsu.edu.ph', admin: true } as unknown as DecodedIdToken
const config: R2Config = {
  accountId: 'account',
  accessKeyId: 'key',
  secretAccessKey: 'secret',
  bucketName: 'repository',
  endpoint: 'https://account.r2.cloudflarestorage.com',
}

function renameRequest() {
  return new Request('http://localhost/api/admin/resource', {
    method: 'PATCH',
    headers: { authorization: 'Bearer valid', 'content-type': 'application/json' },
    body: JSON.stringify({
      key: 'planning-documents/planning-documents/2026/report.pdf',
      filename: 'renamed-report.pdf',
    }),
  })
}

describe('administrator operation authorization', () => {
  it('rejects unauthenticated resource mutations before accessing R2', async () => {
    const response = await handleAdminResourceMutationRequest(new Request('http://localhost/api/admin/resource', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ key: 'planning-documents/planning-documents/2026/report.pdf', confirmation: 'report.pdf' }),
    }))

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toMatchObject({ error: { code: 'UNAUTHORIZED' } })
  })

  it('rejects unauthenticated administrator listing before accessing Firebase Admin', async () => {
    const response = await handleAdminUsersRequest(new Request('http://localhost/api/admin/users'))

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toMatchObject({ error: { code: 'UNAUTHORIZED' } })
  })

  it('lists only Firebase users carrying the administrator claim', async () => {
    const users = [
      {
        uid: 'admin-2',
        email: 'admin2@cpsu.edu.ph',
        displayName: 'Admin Two',
        disabled: false,
        customClaims: { admin: true },
        metadata: { creationTime: '2026-08-13T00:00:00.000Z' },
      },
      {
        uid: 'ordinary-user',
        email: 'user@cpsu.edu.ph',
        displayName: 'Ordinary User',
        disabled: false,
        metadata: { creationTime: '2026-08-13T00:00:00.000Z' },
      },
    ] as unknown as UserRecord[]
    const auth = { listUsers: async () => ({ users }) } as unknown as Auth
    const response = await handleAdminUsersRequest(new Request('http://localhost/api/admin/users', {
      headers: { authorization: 'Bearer valid' },
    }), { verifyIdToken: async () => administrator, auth })

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({ data: [{ uid: 'admin-2' }] })
  })

  it('includes the configured initial administrator without requiring a claim', async () => {
    const user = {
      uid: 'bootstrap-admin',
      email: 'initial-admin@cpsu.edu.ph',
      displayName: 'Initial Admin',
      disabled: false,
      metadata: { creationTime: '2026-08-13T00:00:00.000Z' },
    } as unknown as UserRecord
    const auth = { listUsers: async () => ({ users: [user] }) } as unknown as Auth
    const response = await handleAdminUsersRequest(new Request('http://localhost/api/admin/users', {
      headers: { authorization: 'Bearer valid' },
    }), {
      environment: { FIREBASE_BOOTSTRAP_ADMIN_UID: user.uid },
      verifyIdToken: async () => administrator,
      auth,
    })

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({ data: [{ uid: user.uid }] })
  })

  it('grants the administrator claim to staff accounts created by an administrator', async () => {
    const user = {
      uid: 'admin-3',
      email: 'admin3@cpsu.edu.ph',
      displayName: 'Admin Three',
      disabled: false,
      metadata: { creationTime: '2026-08-13T00:00:00.000Z' },
    } as unknown as UserRecord
    const setCustomUserClaims = vi.fn(async () => undefined)
    const auth = {
      createUser: async () => user,
      setCustomUserClaims,
      deleteUser: async () => undefined,
    } as unknown as Auth
    const response = await handleAdminUsersRequest(new Request('http://localhost/api/admin/users', {
      method: 'POST',
      headers: { authorization: 'Bearer valid', 'content-type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        displayName: user.displayName,
        password: 'a-secure-password-123',
      }),
    }), {
      verifyIdToken: async () => administrator,
      auth,
      audit: async () => '_system/audit/test.json',
    })

    expect(response.status).toBe(201)
    expect(setCustomUserClaims).toHaveBeenCalledWith(user.uid, { admin: true })
  })

  it('fails closed when checking the rename destination returns an unexpected error', async () => {
    const send = vi.fn(async (command: unknown) => {
      expect(command).toBeInstanceOf(HeadObjectCommand)
      throw { $metadata: { httpStatusCode: 500 } }
    })
    const response = await handleAdminResourceMutationRequest(renameRequest(), {
      verifyIdToken: async () => administrator,
      config,
      structure: repositorySections,
      send,
      audit: async () => 'unused',
    })

    expect(response.status).toBe(500)
    expect(send).toHaveBeenCalledTimes(1)
  })

  it('does not delete the source when the conditional rename finds a concurrent duplicate', async () => {
    const commands: unknown[] = []
    const send = vi.fn(async (command: unknown) => {
      commands.push(command)
      if (command instanceof HeadObjectCommand) throw { $metadata: { httpStatusCode: 404 } }
      if (command instanceof CopyObjectCommand) throw { $metadata: { httpStatusCode: 412 } }
      return {}
    })
    const response = await handleAdminResourceMutationRequest(renameRequest(), {
      verifyIdToken: async () => administrator,
      config,
      structure: repositorySections,
      send,
      audit: async () => '_system/audit/test.json',
    })

    expect(response.status).toBe(409)
    expect(commands.some((command) => command instanceof DeleteObjectCommand)).toBe(false)
  })
})
