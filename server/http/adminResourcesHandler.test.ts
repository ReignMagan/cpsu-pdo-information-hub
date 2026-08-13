import type { DecodedIdToken } from 'firebase-admin/auth'
import { describe, expect, it, vi } from 'vitest'
import type { R2Config } from '../config/r2'
import { handleAdminResourcesRequest } from './adminResourcesHandler'

const verifiedAdministrator = {
  uid: 'administrator-1',
  email: 'cpsu_pdo@cpsu.edu.ph',
  admin: true,
} as unknown as DecodedIdToken

const testConfig: R2Config = {
  accountId: 'test-account',
  accessKeyId: 'test-access-key',
  secretAccessKey: 'test-secret-key',
  bucketName: 'repository-bucket',
  endpoint: 'https://test-account.r2.cloudflarestorage.com',
  publicBaseUrl: 'https://resources.example.edu',
}

describe('handleAdminResourcesRequest', () => {
  it('verifies the administrator before listing resources', async () => {
    const verifyIdToken = vi.fn(async () => verifiedAdministrator)
    const response = await handleAdminResourcesRequest(
      new Request('http://localhost/api/admin/resources?limit=25', {
        headers: { authorization: 'Bearer valid-token' },
      }),
      {
        verifyIdToken,
        resources: {
          config: testConfig,
          listObjects: async () => ({ Contents: [], IsTruncated: false }),
        },
      },
    )

    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe('private, no-store')
    expect(verifyIdToken).toHaveBeenCalledWith('valid-token', undefined)
    await expect(response.json()).resolves.toEqual({
      data: [],
      meta: { total: 0, nextCursor: null },
    })
  })

  it('does not access R2 when authentication is missing', async () => {
    const listObjects = vi.fn(async () => ({ Contents: [], IsTruncated: false }))
    const response = await handleAdminResourcesRequest(
      new Request('http://localhost/api/admin/resources'),
      { resources: { config: testConfig, listObjects } },
    )

    expect(response.status).toBe(401)
    expect(listObjects).not.toHaveBeenCalled()
  })

  it('does not access R2 when token verification fails', async () => {
    const listObjects = vi.fn(async () => ({ Contents: [], IsTruncated: false }))
    const response = await handleAdminResourcesRequest(
      new Request('http://localhost/api/admin/resources', {
        headers: { authorization: 'Bearer invalid-token' },
      }),
      {
        verifyIdToken: async () => { throw new Error('private provider detail') },
        resources: { config: testConfig, listObjects },
      },
    )

    expect(response.status).toBe(401)
    expect(listObjects).not.toHaveBeenCalled()
    await expect(response.json()).resolves.toEqual({
      error: {
        code: 'UNAUTHORIZED',
        message: 'The administrator session is invalid or expired.',
      },
    })
  })

  it('preserves resource query validation behind authentication', async () => {
    const response = await handleAdminResourcesRequest(
      new Request('http://localhost/api/admin/resources?limit=1000', {
        headers: { authorization: 'Bearer valid-token' },
      }),
      {
        verifyIdToken: async () => verifiedAdministrator,
        resources: {
          config: testConfig,
          listObjects: async () => ({ Contents: [], IsTruncated: false }),
        },
      },
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toMatchObject({ error: { code: 'INVALID_QUERY' } })
  })
})
