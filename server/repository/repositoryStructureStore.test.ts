import { describe, expect, it } from 'vitest'
import type { ManagedSection } from '../../src/contracts/repositoryStructure.ts'
import { createRepositoryStructureWriteCommand } from './repositoryStructureStore.ts'

const data: ManagedSection[] = [{ id: 'reports', title: 'Reports', categories: [] }]

describe('repository structure conditional writes', () => {
  it('requires the current ETag when updating an existing structure', () => {
    const command = createRepositoryStructureWriteCommand('bucket', data, '"revision-1"')
    expect(command.input.IfMatch).toBe('"revision-1"')
    expect(command.input.IfNoneMatch).toBeUndefined()
  })

  it('creates the initial structure only when it does not already exist', () => {
    const command = createRepositoryStructureWriteCommand('bucket', data, null)
    expect(command.input.IfNoneMatch).toBe('*')
    expect(command.input.IfMatch).toBeUndefined()
  })
})
