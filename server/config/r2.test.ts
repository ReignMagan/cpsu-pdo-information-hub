import { describe, expect, it } from 'vitest'
import { getR2Config, R2ConfigurationError } from './r2'

const validEnvironment = {
  R2_ACCOUNT_ID: 'account-id',
  R2_ACCESS_KEY_ID: 'access-key',
  R2_SECRET_ACCESS_KEY: 'secret-key',
  R2_BUCKET_NAME: 'repository-bucket',
}

describe('getR2Config', () => {
  it('creates the default private S3 API endpoint', () => {
    expect(getR2Config(validEnvironment)).toEqual({
      accountId: 'account-id',
      accessKeyId: 'access-key',
      secretAccessKey: 'secret-key',
      bucketName: 'repository-bucket',
      endpoint: 'https://account-id.r2.cloudflarestorage.com',
    })
  })

  it('accepts an explicit jurisdiction endpoint', () => {
    expect(
      getR2Config({
        ...validEnvironment,
        R2_ENDPOINT: 'https://account-id.eu.r2.cloudflarestorage.com',
      }).endpoint,
    ).toBe('https://account-id.eu.r2.cloudflarestorage.com')
  })

  it('treats an empty optional endpoint as absent', () => {
    expect(getR2Config({ ...validEnvironment, R2_ENDPOINT: '' }).endpoint).toBe(
      'https://account-id.r2.cloudflarestorage.com',
    )
  })

  it('allows HTTP only for local development endpoints', () => {
    expect(getR2Config({
      ...validEnvironment,
      R2_ENDPOINT: 'http://127.0.0.1:9000',
    }).endpoint).toBe('http://127.0.0.1:9000')
    expect(() => getR2Config({
      ...validEnvironment,
      R2_ENDPOINT: 'http://storage.example.edu',
    })).toThrow(R2ConfigurationError)
  })

  it('requires HTTPS for production even when the host is local', () => {
    expect(() => getR2Config({
      ...validEnvironment,
      VERCEL_ENV: 'production',
      R2_ENDPOINT: 'http://localhost:9000',
    })).toThrow(R2ConfigurationError)
  })

  it('rejects incomplete configuration without exposing values', () => {
    expect(() => getR2Config({ R2_SECRET_ACCESS_KEY: 'do-not-expose' })).toThrow(
      R2ConfigurationError,
    )
    expect(() => getR2Config({ R2_SECRET_ACCESS_KEY: 'do-not-expose' })).toThrow(
      'Cloudflare R2 server configuration is incomplete or invalid.',
    )
  })
})
