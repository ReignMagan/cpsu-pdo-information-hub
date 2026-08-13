import { resourceSchema, type Resource, type ResourceListResponse, type ResourceQuery } from '../../src/contracts/resource.ts'
import { repositoryCategoryById } from '../../src/config/repository.ts'
import { getR2Config, type R2Config } from '../config/r2.ts'
import { parseResourceObjectKey } from './parseResourceObjectKey.ts'
import { createR2Client, createR2ObjectLister, type ListR2Objects, type R2ObjectSummary } from './r2Client.ts'
import { readRepositoryStructure } from './repositoryStructureStore.ts'
import { repositorySections } from '../../src/config/repository.ts'
type StructureSection = { id: string; title: string; categories: readonly { id: string; title: string }[] }

const r2PageSize = 1000
const maximumListedObjects = 10_000

export class InvalidResourceCursorError extends Error {
  constructor() {
    super('The repository cursor is invalid.')
    this.name = 'InvalidResourceCursorError'
  }
}

export type ListResourcesDependencies = {
  environment?: NodeJS.ProcessEnv
  config?: R2Config
  listObjects?: ListR2Objects
  structure?: readonly StructureSection[]
}

function getListPrefix(query: ResourceQuery): string | undefined {
  if (query.section && query.category) return `${query.section}/${query.category}/`
  if (query.section) return `${query.section}/`

  if (query.category) {
    const category = repositoryCategoryById.get(query.category)
    return category ? `${category.sectionId}/${category.id}/` : undefined
  }

  return undefined
}

async function getAllObjectSummaries(
  bucketName: string,
  prefix: string | undefined,
  listObjects: ListR2Objects,
): Promise<R2ObjectSummary[]> {
  const objects: R2ObjectSummary[] = []
  let continuationToken: string | undefined

  do {
    const page = await listObjects({
      Bucket: bucketName,
      ContinuationToken: continuationToken,
      MaxKeys: r2PageSize,
      Prefix: prefix,
    })

    objects.push(...(page.Contents ?? []))
    if (objects.length > maximumListedObjects) {
      throw new Error('The repository listing exceeds the supported Version 1 limit.')
    }

    continuationToken = page.IsTruncated ? page.NextContinuationToken : undefined
    if (page.IsTruncated && !continuationToken) {
      throw new Error('The repository returned an incomplete pagination response.')
    }
  } while (continuationToken)

  return objects
}

function createPublicResourceUrl(baseUrl: string, key: string): string {
  const encodedKey = key.split('/').map(encodeURIComponent).join('/')
  return `${baseUrl}/${encodedKey}`
}

function mapObjectToResource(object: R2ObjectSummary, publicBaseUrl: string, structure: readonly StructureSection[]): Resource | null {
  if (!object.Key || object.Size === undefined || !object.LastModified) return null

  try {
    const parsedKey = parseResourceObjectKey(object.Key, structure)
    const publicUrl = createPublicResourceUrl(publicBaseUrl, parsedKey.key)

    return resourceSchema.parse({
      key: parsedKey.key,
      filename: parsedKey.filename,
      displayName: parsedKey.displayName,
      sectionId: parsedKey.sectionId,
      categoryId: parsedKey.categoryId,
      year: parsedKey.year,
      fileType: parsedKey.fileType,
      mimeType: parsedKey.mimeType,
      fileSize: object.Size,
      uploadedAt: object.LastModified.toISOString(),
      downloadUrl: publicUrl,
      previewUrl: parsedKey.fileType === 'xlsx' ? undefined : publicUrl,
    })
  } catch {
    return null
  }
}

function matchesQuery(resource: Resource, query: ResourceQuery): boolean {
  if (query.section && resource.sectionId !== query.section) return false
  if (query.category && resource.categoryId !== query.category) return false
  if (query.year && resource.year !== query.year) return false
  if (query.fileType && resource.fileType !== query.fileType) return false

  if (query.q) {
    const searchValue = query.q.toLocaleLowerCase()
    const searchableText = [
      resource.filename,
      resource.displayName,
      resource.sectionId,
      resource.categoryId,
      String(resource.year),
      resource.fileType,
    ]
      .join(' ')
      .toLocaleLowerCase()

    if (!searchableText.includes(searchValue)) return false
  }

  return true
}

function compareByKey(left: Resource, right: Resource): number {
  return left.key.localeCompare(right.key)
}

function sortResources(resources: Resource[], sort: ResourceQuery['sort']): Resource[] {
  return resources.sort((left, right) => {
    let comparison = 0

    switch (sort) {
      case 'oldest':
        comparison = left.uploadedAt.localeCompare(right.uploadedAt)
        break
      case 'name-asc':
        comparison = left.displayName.localeCompare(right.displayName)
        break
      case 'name-desc':
        comparison = right.displayName.localeCompare(left.displayName)
        break
      case 'file-size':
        comparison = right.fileSize - left.fileSize
        break
      case 'file-type':
        comparison = left.fileType.localeCompare(right.fileType)
        break
      case 'newest':
        comparison = right.uploadedAt.localeCompare(left.uploadedAt)
        break
    }

    return comparison || compareByKey(left, right)
  })
}

function decodeCursor(cursor: string | undefined): number {
  if (!cursor) return 0

  try {
    const decoded = Buffer.from(cursor, 'base64url').toString('utf8')
    if (!/^\d+$/u.test(decoded)) throw new InvalidResourceCursorError()

    const offset = Number(decoded)
    if (!Number.isSafeInteger(offset) || offset < 0) throw new InvalidResourceCursorError()
    return offset
  } catch (error) {
    if (error instanceof InvalidResourceCursorError) throw error
    throw new InvalidResourceCursorError()
  }
}

function encodeCursor(offset: number): string {
  return Buffer.from(String(offset), 'utf8').toString('base64url')
}

export async function listResources(
  query: ResourceQuery,
  dependencies: ListResourcesDependencies = {},
): Promise<ResourceListResponse> {
  const config = dependencies.config ?? getR2Config(dependencies.environment)
  const structure = dependencies.structure ?? (dependencies.environment ? await readRepositoryStructure(dependencies.environment) : repositorySections)
  const listObjects =
    dependencies.listObjects ?? createR2ObjectLister(createR2Client(config))
  const objectSummaries = await getAllObjectSummaries(
    config.bucketName,
    getListPrefix(query),
    listObjects,
  )
  const resources = sortResources(
    objectSummaries
      .map((object) => mapObjectToResource(object, config.publicBaseUrl, structure))
      .filter((resource): resource is Resource => resource !== null)
      .filter((resource) => matchesQuery(resource, query)),
    query.sort,
  )
  const offset = decodeCursor(query.cursor)
  const data = resources.slice(offset, offset + query.limit)
  const nextOffset = offset + data.length

  return {
    data,
    meta: {
      total: resources.length,
      nextCursor: nextOffset < resources.length ? encodeCursor(nextOffset) : null,
    },
  }
}
