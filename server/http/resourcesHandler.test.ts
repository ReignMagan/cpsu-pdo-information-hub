import { describe, expect, it } from 'vitest'
import { handleResourcesRequest } from './resourcesHandler'

const testR2Config = {
  accountId: 'test-account',
  accessKeyId: 'test-access-key',
  secretAccessKey: 'test-secret-key',
  bucketName: 'test-bucket',
  endpoint: 'https://test-account.r2.cloudflarestorage.com',
  publicBaseUrl: 'https://resources.example.edu',
}

const emptyRepository = {
  config: testR2Config,
  listObjects: async () => ({ Contents: [], IsTruncated: false }),
}

describe('handleResourcesRequest', () => {
  it('returns the stable empty repository response', async () => {
    const response = await handleResourcesRequest(
      new Request('http://localhost/api/resources'),
      emptyRepository,
    )
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      data: [],
      meta: { total: 0, nextCursor: null },
    })
  })

  it('rejects unsupported HTTP methods', async () => {
    const response = await handleResourcesRequest(
      new Request('http://localhost/api/resources', { method: 'POST' }),
    )
    expect(response.status).toBe(405)
    expect(response.headers.get('allow')).toBe('GET')
  })

  it('rejects malformed queries with a safe error response', async () => {
    const response = await handleResourcesRequest(
      new Request('http://localhost/api/resources?limit=1000'),
    )
    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toMatchObject({
      error: { code: 'INVALID_QUERY' },
    })
  })

  it('rejects categories outside the application taxonomy', async () => {
    const response = await handleResourcesRequest(
      new Request('http://localhost/api/resources?category=unknown-category'),
    )
    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toMatchObject({
      error: { code: 'INVALID_CATEGORY' },
    })
  })

  it('rejects categories that do not belong to the selected section', async () => {
    const response = await handleResourcesRequest(
      new Request(
        'http://localhost/api/resources?section=statistical-profile&category=accreditation',
      ),
    )
    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: {
        code: 'INVALID_CATEGORY',
        message: 'The requested category does not belong to the selected section.',
      },
    })
  })

  it('returns a safe invalid-cursor response', async () => {
    const response = await handleResourcesRequest(
      new Request('http://localhost/api/resources?cursor=not-a-valid-cursor'),
      emptyRepository,
    )
    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: {
        code: 'INVALID_CURSOR',
        message: 'The repository pagination cursor is invalid.',
      },
    })
  })
})
