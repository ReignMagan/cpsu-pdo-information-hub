import {
  resourceFileDefinitions,
  resourceFilenameSchema,
  resourceObjectKeySchema,
  type RepositorySectionId,
  type ResourceFileExtension,
  type ResourceFileType,
} from '../../src/contracts/resource.ts'
import { repositorySections } from '../../src/config/repository.ts'
type StructureSection = { id: string; title: string; categories: readonly { id: string; title: string }[] }

const repositoryPathSegmentPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u
const repositoryYearPattern = /^\d{4}(?:-\d{4})?$/u

export type ParsedResourceObjectKey = {
  key: string
  filename: string
  displayName: string
  sectionId: RepositorySectionId
  categoryId?: string
  categoryPath: readonly string[]
  year: number | string
  extension: ResourceFileExtension
  fileType: ResourceFileType
  mimeType: string
}

export class InvalidResourceObjectKeyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidResourceObjectKeyError'
  }
}

function invalidKey(message: string): never {
  throw new InvalidResourceObjectKeyError(message)
}

function createFallbackDisplayName(filename: string): string {
  const extensionStart = filename.lastIndexOf('.')
  const nameWithoutExtension = extensionStart > 0 ? filename.slice(0, extensionStart) : filename
  const normalizedName = nameWithoutExtension.replace(/[-_]+/gu, ' ').replace(/\s+/gu, ' ').trim()

  if (!normalizedName) invalidKey('The resource filename must include a descriptive name.')

  return normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1)
}

/**
 * Parses the stable R2 key convention:
 * section/[optional-category/subcategory/...]/year/filename.ext
 */
export function parseResourceObjectKey(rawKey: string, sections: readonly StructureSection[] = repositorySections): ParsedResourceObjectKey {
  const keyResult = resourceObjectKeySchema.safeParse(rawKey)
  if (!keyResult.success) invalidKey('The resource object key is unsafe.')

  const segments = keyResult.data.split('/')
  if (segments.length < 3 || segments.some((segment) => segment.length === 0)) {
    invalidKey('The resource object key does not follow the repository hierarchy.')
  }

  const sectionValue = segments[0]
  const categoryPath = segments.slice(1, -2)
  const categoryId = categoryPath[0]
  const yearValue = segments.at(-2)
  const filenameValue = segments.at(-1)

  const section = sections.find((item) => item.id === sectionValue)
  if (!section) invalidKey('The resource object key uses an unknown repository section.')

  if (categoryPath.some((segment) => !repositoryPathSegmentPattern.test(segment)) || (categoryId && !section.categories.some((category) => category.id === categoryId))) {
    invalidKey('The resource object key uses an invalid category hierarchy.')
  }

  if (!yearValue || !repositoryYearPattern.test(yearValue)) {
    invalidKey('The resource object key must contain a valid year or school year.')
  }

  const isSchoolYear = yearValue.includes('-')
  const firstYear = Number(yearValue.slice(0, 4))
  const finalYear = isSchoolYear ? Number(yearValue.slice(5)) : firstYear
  if (firstYear < 1900 || firstYear > 2200 || finalYear !== firstYear + (isSchoolYear ? 1 : 0)) invalidKey('The resource year is outside the supported range.')
  const year = isSchoolYear ? yearValue : firstYear

  const filenameResult = resourceFilenameSchema.safeParse(filenameValue)
  if (!filenameResult.success) invalidKey('The resource object key contains an unsafe filename.')

  const extensionValue = filenameResult.data.split('.').pop()?.toLowerCase()
  const definition = extensionValue
    ? resourceFileDefinitions[extensionValue as ResourceFileExtension]
    : undefined

  if (!extensionValue || !definition) {
    invalidKey('The resource object key uses an unsupported file extension.')
  }

  return {
    key: keyResult.data,
    filename: filenameResult.data,
    displayName: createFallbackDisplayName(filenameResult.data),
    sectionId: section.id,
    categoryId,
    categoryPath,
    year,
    extension: extensionValue as ResourceFileExtension,
    fileType: definition.fileType,
    mimeType: definition.mimeType,
  }
}
