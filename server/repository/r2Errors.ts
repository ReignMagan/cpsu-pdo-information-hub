export function getR2ErrorStatus(error: unknown) {
  if (typeof error !== 'object' || error === null || !('$metadata' in error)) {
    return undefined
  }
  return (error.$metadata as { httpStatusCode?: number }).httpStatusCode
}

export function isR2NotFound(error: unknown) {
  return getR2ErrorStatus(error) === 404 || (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    error.name === 'NoSuchKey'
  )
}

export function isR2PreconditionFailed(error: unknown) {
  return getR2ErrorStatus(error) === 412 || (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    error.name === 'PreconditionFailed'
  )
}
