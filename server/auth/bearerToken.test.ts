import { describe, expect, it } from 'vitest'
import { parseBearerToken } from './bearerToken'

describe('parseBearerToken', () => {
  it('extracts one Bearer token', () => {
    expect(parseBearerToken('Bearer header.payload.signature')).toBe('header.payload.signature')
  })

  it.each([null, '', 'Basic token', 'bearer token', 'Bearer', 'Bearer one two', 'Bearer one,two'])(
    'rejects an invalid authorization header: %s',
    (header) => expect(parseBearerToken(header)).toBeNull(),
  )
})
