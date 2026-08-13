import type { DecodedIdToken } from 'firebase-admin/auth'
import { describe, expect, it } from 'vitest'
import {
  AdminAuthenticationError,
  AdminAuthorizationError,
  authenticateAdminRequest,
} from './authenticateAdminRequest.ts'

const request = new Request('https://example.edu/api/admin/session', {
  headers: { authorization: 'Bearer valid-token' },
})

describe('authenticateAdminRequest', () => {
  it('accepts a verified identity with the administrator claim', async () => {
    const identity = { uid: 'admin-1', admin: true } as unknown as DecodedIdToken
    await expect(authenticateAdminRequest(request, {
      verifyIdToken: async () => identity,
    })).resolves.toBe(identity)
  })

  it('rejects a valid identity without the administrator claim', async () => {
    await expect(authenticateAdminRequest(request, {
      verifyIdToken: async () => ({ uid: 'user-1' }) as DecodedIdToken,
    })).rejects.toBeInstanceOf(AdminAuthorizationError)
  })

  it('accepts the initial administrator UID from server-only configuration', async () => {
    const identity = { uid: 'bootstrap-admin' } as DecodedIdToken
    await expect(authenticateAdminRequest(request, {
      environment: { FIREBASE_BOOTSTRAP_ADMIN_UID: 'bootstrap-admin' },
      verifyIdToken: async () => identity,
    })).resolves.toBe(identity)
  })

  it('does not authorize a different Firebase UID', async () => {
    await expect(authenticateAdminRequest(request, {
      environment: { FIREBASE_BOOTSTRAP_ADMIN_UID: 'approved-admin' },
      verifyIdToken: async () => ({ uid: 'different-user' }) as DecodedIdToken,
    })).rejects.toBeInstanceOf(AdminAuthorizationError)
  })

  it('keeps token verification failures separate from authorization', async () => {
    await expect(authenticateAdminRequest(request, {
      verifyIdToken: async () => { throw new Error('provider detail') },
    })).rejects.toBeInstanceOf(AdminAuthenticationError)
  })
})
