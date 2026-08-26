import { GetObjectCommand } from '@aws-sdk/client-s3'
import type { DecodedIdToken } from 'firebase-admin/auth'
import { describe, expect, it, vi } from 'vitest'
import { repositorySections } from '../../src/config/repository'
import type { R2Config } from '../config/r2'
import { handleAdminResourceAccessRequest } from './adminResourceAccessHandler'

const administrator = {
  uid: 'administrator-1',
  email: 'cpsu_pdo@cpsu.edu.ph',
  admin: true,
} as unknown as DecodedIdToken

const config: R2Config = {
  accountId: 'test-account',
  accessKeyId: 'test-access-key',
  secretAccessKey: 'test-secret-key',
  bucketName: 'repository-bucket',
  endpoint: 'https://test-account.r2.cloudflarestorage.com',
}

function accessRequest(
  key: string,
  mode: 'preview' | 'download' = 'preview',
  token = 'valid-token',
) {
  return new Request('http://localhost/api/admin/resource-access', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ key, mode }),
  })
}

describe('handleAdminResourceAccessRequest', () => {
  it('rejects unauthenticated access before signing an R2 request', async () => {
    const sign = vi.fn(async () => 'https://signed.example.edu/file')
    const response = await handleAdminResourceAccessRequest(
      new Request('http://localhost/api/admin/resource-access', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          key: 'planning-documents/planning-documents/2026/Annual Report.pdf',
          mode: 'preview',
        }),
      }),
      { config, sign },
    )

    expect(response.status).toBe(401)
    expect(sign).not.toHaveBeenCalled()
    await expect(response.json()).resolves.toMatchObject({
      error: { code: 'UNAUTHORIZED' },
    })
  })

  it('rejects Excel preview requests without signing access', async () => {
    const sign = vi.fn(async () => 'https://signed.example.edu/file')
    const audit = vi.fn(async () => '_system/audit/test.json')
    const response = await handleAdminResourceAccessRequest(
      accessRequest(
        'statistical-profile/student-population/2026/Statistics.xlsx',
      ),
      {
        verifyIdToken: async () => administrator,
        config,
        structure: repositorySections,
        sign,
        audit,
      },
    )

    expect(response.status).toBe(400)
    expect(sign).not.toHaveBeenCalled()
    expect(audit).not.toHaveBeenCalled()
    await expect(response.json()).resolves.toEqual({
      error: {
        code: 'RESOURCE_NOT_PREVIEWABLE',
        message: 'This file type is available for staff download only.',
      },
    })
  })

  it('signs one authenticated GET for 60 seconds and records the access', async () => {
    const now = new Date('2026-08-24T05:00:00.000Z')
    const sign = vi.fn(
      async (command: GetObjectCommand, expiresIn: number) => {
        expect(command).toBeInstanceOf(GetObjectCommand)
        expect(command.input).toMatchObject({
          Bucket: 'repository-bucket',
          Key: 'planning-documents/planning-documents/2026/Annual Report.pdf',
          ResponseContentDisposition:
            "inline; filename*=UTF-8''Annual%20Report.pdf",
          ResponseContentType: 'application/pdf',
        })
        expect(expiresIn).toBe(60)
        return 'https://test-account.r2.cloudflarestorage.com/signed-file'
      },
    )
    const audit = vi.fn(async () => '_system/audit/test.json')

    const response = await handleAdminResourceAccessRequest(
      accessRequest(
        'planning-documents/planning-documents/2026/Annual Report.pdf',
      ),
      {
        verifyIdToken: async () => administrator,
        config,
        structure: repositorySections,
        sign,
        audit,
        now: () => now,
      },
    )

    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe('private, no-store')
    await expect(response.json()).resolves.toEqual({
      data: {
        url: 'https://test-account.r2.cloudflarestorage.com/signed-file',
        expiresAt: '2026-08-24T05:01:00.000Z',
      },
    })
    expect(sign).toHaveBeenCalledTimes(1)
    expect(audit).toHaveBeenCalledWith(
      {
        action: 'resource.accessed',
        actor: administrator,
        target:
          'planning-documents/planning-documents/2026/Annual Report.pdf',
        outcome: 'succeeded',
        details: { mode: 'preview' },
      },
      undefined,
    )
  })
})
