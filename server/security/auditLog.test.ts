import { describe, expect, it } from 'vitest'
import { createAuditWriteCommand } from './auditLog.ts'

describe('audit log writes', () => {
  it('writes an immutable event into the configured private bucket', () => {
    const command = createAuditWriteCommand(
      'private-audit-bucket',
      '_system/audit/2026/08/13/event.json',
      { action: 'resource.deleted' },
    )
    expect(command.input).toMatchObject({
      Bucket: 'private-audit-bucket',
      IfNoneMatch: '*',
      ContentType: 'application/json',
      CacheControl: 'private, no-store',
    })
  })
})
