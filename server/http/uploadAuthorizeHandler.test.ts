import type { DecodedIdToken } from 'firebase-admin/auth'
import { describe, expect, it } from 'vitest'
import type { R2Config } from '../config/r2'
import { handleUploadAuthorizeRequest } from './uploadAuthorizeHandler'

const config: R2Config = { accountId: 'account', accessKeyId: 'key', secretAccessKey: 'secret', bucketName: 'bucket', endpoint: 'https://account.r2.cloudflarestorage.com', publicBaseUrl: 'https://resources.example.edu' }
const identity = { uid: 'admin', email: 'admin@cpsu.edu.ph', admin: true } as unknown as DecodedIdToken
const body = { filename: 'report.pdf', sectionId: 'planning-documents', categoryId: 'planning-documents', year: 2026, mimeType: 'application/pdf', fileSize: 1024 }

describe('handleUploadAuthorizeRequest', () => {
  it('requires authentication before parsing upload data', async () => {
    const response = await handleUploadAuthorizeRequest(new Request('http://localhost/api/admin/resources/upload-authorize', { method: 'POST', body: '{}' }))
    expect(response.status).toBe(401)
  })

  it('authorizes one validated non-duplicate upload', async () => {
    const response = await handleUploadAuthorizeRequest(new Request('http://localhost/api/admin/resources/upload-authorize', { method: 'POST', headers: { authorization: 'Bearer valid', 'content-type': 'application/json' }, body: JSON.stringify(body) }), { verifyIdToken: async () => identity, upload: { config, objectExists: async () => false, createUploadUrl: async () => 'https://upload.example.edu/signed' } })
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({ data: { uploadUrl: 'https://upload.example.edu/signed', expiresInSeconds: 300 } })
  })

  it('rejects oversized files', async () => {
    const response = await handleUploadAuthorizeRequest(new Request('http://localhost/api/admin/resources/upload-authorize', { method: 'POST', headers: { authorization: 'Bearer valid', 'content-type': 'application/json' }, body: JSON.stringify({ ...body, fileSize: 26 * 1024 * 1024 }) }), { verifyIdToken: async () => identity })
    expect(response.status).toBe(400)
  })

  it('rejects Excel upload requests', async () => {
    const response = await handleUploadAuthorizeRequest(new Request('http://localhost/api/admin/resources/upload-authorize', { method: 'POST', headers: { authorization: 'Bearer valid', 'content-type': 'application/json' }, body: JSON.stringify({ ...body, filename: 'statistics.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }) }), { verifyIdToken: async () => identity })
    expect(response.status).toBe(400)
  })
})
