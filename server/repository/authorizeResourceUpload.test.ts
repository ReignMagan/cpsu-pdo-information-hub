import { describe, expect, it, vi } from 'vitest'
import type { ResourceUploadRequest } from '../../src/contracts/resourceUpload'
import type { R2Config } from '../config/r2'
import { authorizeResourceUpload, DuplicateResourceError, InvalidResourceUploadError } from './authorizeResourceUpload'

const config: R2Config = { accountId: 'account', accessKeyId: 'key', secretAccessKey: 'secret', bucketName: 'bucket', endpoint: 'https://account.r2.cloudflarestorage.com', publicBaseUrl: 'https://resources.example.edu' }
const validInput: ResourceUploadRequest = { filename: 'Annual Report FINAL.pdf', sectionId: 'planning-documents', categoryId: 'planning-documents', year: 2026, mimeType: 'application/pdf', fileSize: 1024 }

describe('authorizeResourceUpload', () => {
  it('derives a safe key and a short-lived upload authorization', async () => {
    const createUploadUrl = vi.fn(async () => 'https://upload.example.edu/signed')
    const result = await authorizeResourceUpload(validInput, { config, objectExists: async () => false, createUploadUrl })
    expect(result).toEqual({ key: 'planning-documents/planning-documents/2026/Annual Report FINAL.pdf', uploadUrl: 'https://upload.example.edu/signed', expiresInSeconds: 300, headers: { 'content-type': 'application/pdf', 'if-none-match': '*' } })
  })

  it('allows a file to be uploaded directly into a section', async () => {
    const createUploadUrl = vi.fn(async () => 'https://upload.example.edu/signed')
    const result = await authorizeResourceUpload({ ...validInput, categoryId: undefined, year: '2025-2026' }, { config, objectExists: async () => false, createUploadUrl })
    expect(result.key).toBe('planning-documents/2025-2026/Annual Report FINAL.pdf')
  })

  it('rejects mismatched MIME types', async () => {
    await expect(authorizeResourceUpload({ ...validInput, mimeType: 'image/png' }, { config })).rejects.toBeInstanceOf(InvalidResourceUploadError)
  })

  it('rejects Excel files even when extension and MIME type match', async () => {
    await expect(authorizeResourceUpload({
      ...validInput,
      filename: 'statistics.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' as ResourceUploadRequest['mimeType'],
    }, { config })).rejects.toBeInstanceOf(InvalidResourceUploadError)
  })

  it('rejects category and section mismatches', async () => {
    await expect(authorizeResourceUpload({ ...validInput, sectionId: 'statistical-profile' }, { config })).rejects.toBeInstanceOf(InvalidResourceUploadError)
  })

  it('rejects duplicate keys without creating an upload URL', async () => {
    const createUploadUrl = vi.fn(async () => 'https://upload.example.edu/signed')
    await expect(authorizeResourceUpload(validInput, { config, objectExists: async () => true, createUploadUrl })).rejects.toBeInstanceOf(DuplicateResourceError)
    expect(createUploadUrl).not.toHaveBeenCalled()
  })
})
