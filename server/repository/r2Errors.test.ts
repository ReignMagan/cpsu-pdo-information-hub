import { describe, expect, it } from 'vitest'
import { isR2NotFound, isR2PreconditionFailed } from './r2Errors.ts'

describe('R2 error classification', () => {
  it('does not treat infrastructure errors as missing objects', () => {
    expect(isR2NotFound({ $metadata: { httpStatusCode: 500 } })).toBe(false)
    expect(isR2NotFound({ $metadata: { httpStatusCode: 404 } })).toBe(true)
  })

  it('recognizes conditional write conflicts', () => {
    expect(isR2PreconditionFailed({ $metadata: { httpStatusCode: 412 } })).toBe(true)
    expect(isR2PreconditionFailed({ $metadata: { httpStatusCode: 409 } })).toBe(false)
  })
})
