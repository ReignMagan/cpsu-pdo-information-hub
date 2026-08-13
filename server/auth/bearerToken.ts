const bearerTokenPattern = /^Bearer ([^\s,]+)$/u
const maximumTokenLength = 8_192

export function parseBearerToken(authorizationHeader: string | null) {
  if (!authorizationHeader || authorizationHeader.length > maximumTokenLength) return null
  return bearerTokenPattern.exec(authorizationHeader)?.[1] ?? null
}
