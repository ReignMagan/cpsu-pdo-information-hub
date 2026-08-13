import { describe, expect, it } from 'vitest'
import { FirebaseAdminConfigurationError, getFirebaseAdminConfig } from './firebaseAdmin'

describe('getFirebaseAdminConfig', () => {
  it('normalizes escaped private-key line breaks', () => {
    expect(getFirebaseAdminConfig({
      FIREBASE_ADMIN_PROJECT_ID: 'test-project',
      FIREBASE_ADMIN_CLIENT_EMAIL: 'firebase-admin@test-project.iam.gserviceaccount.com',
      FIREBASE_ADMIN_PRIVATE_KEY: 'line-one\\nline-two',
    })).toEqual({
      projectId: 'test-project',
      clientEmail: 'firebase-admin@test-project.iam.gserviceaccount.com',
      privateKey: 'line-one\nline-two',
    })
  })

  it('rejects incomplete server configuration', () => {
    expect(() => getFirebaseAdminConfig({})).toThrow(FirebaseAdminConfigurationError)
  })
})
