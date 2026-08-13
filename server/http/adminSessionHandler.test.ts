import type { DecodedIdToken } from 'firebase-admin/auth'
import { describe, expect, it, vi } from 'vitest'
import { handleAdminSessionRequest } from './adminSessionHandler'

const verifiedToken = {
  uid: 'firebase-user-1',
  email: 'cpsu_pdo@cpsu.edu.ph',
  admin: true,
} as unknown as DecodedIdToken

describe('handleAdminSessionRequest', () => {
  it('returns the verified administrator identity', async () => {
    const verifyIdToken = vi.fn(async () => verifiedToken)
    const response = await handleAdminSessionRequest(
      new Request('http://localhost/api/admin/session', {
        headers: { authorization: 'Bearer valid-token' },
      }),
      { verifyIdToken },
    )
    expect(response.status).toBe(200)
    expect(verifyIdToken).toHaveBeenCalledWith('valid-token', undefined)
    await expect(response.json()).resolves.toEqual({
      data: { uid: 'firebase-user-1', email: 'cpsu_pdo@cpsu.edu.ph' },
    })
  })

  it('rejects a missing token without calling Firebase', async () => {
    const verifyIdToken = vi.fn(async () => verifiedToken)
    const response = await handleAdminSessionRequest(
      new Request('http://localhost/api/admin/session'),
      { verifyIdToken },
    )
    expect(response.status).toBe(401)
    expect(verifyIdToken).not.toHaveBeenCalled()
  })

  it('rejects an invalid or expired token with a safe response', async () => {
    const response = await handleAdminSessionRequest(
      new Request('http://localhost/api/admin/session', {
        headers: { authorization: 'Bearer invalid-token' },
      }),
      { verifyIdToken: async () => { throw new Error('private Firebase detail') } },
    )
    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({
      error: { code: 'UNAUTHORIZED', message: 'The administrator session is invalid or expired.' },
    })
  })

  it('requires an email-bearing Firebase identity', async () => {
    const response = await handleAdminSessionRequest(
      new Request('http://localhost/api/admin/session', {
        headers: { authorization: 'Bearer valid-token' },
      }),
      { verifyIdToken: async () => ({ uid: 'anonymous-user', admin: true }) as unknown as DecodedIdToken },
    )
    expect(response.status).toBe(403)
  })

  it('rejects a valid Firebase user without the administrator claim', async () => {
    const response = await handleAdminSessionRequest(
      new Request('http://localhost/api/admin/session', {
        headers: { authorization: 'Bearer valid-token' },
      }),
      { verifyIdToken: async () => ({ uid: 'ordinary-user', email: 'user@example.edu' }) as DecodedIdToken },
    )
    expect(response.status).toBe(403)
    await expect(response.json()).resolves.toEqual({
      error: { code: 'FORBIDDEN', message: 'This account does not have administrator access.' },
    })
  })

  it('rejects unsupported methods', async () => {
    const response = await handleAdminSessionRequest(
      new Request('http://localhost/api/admin/session', { method: 'POST' }),
    )
    expect(response.status).toBe(405)
    expect(response.headers.get('allow')).toBe('GET')
  })
})
