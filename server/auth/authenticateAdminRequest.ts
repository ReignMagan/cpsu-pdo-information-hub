import type { DecodedIdToken } from 'firebase-admin/auth'
import { parseBearerToken } from './bearerToken.ts'
import { verifyFirebaseIdToken } from './verifyFirebaseIdToken.ts'

export type AdminAuthenticationDependencies = {
  environment?: NodeJS.ProcessEnv
  verifyIdToken?: (
    token: string,
    environment?: NodeJS.ProcessEnv,
  ) => Promise<DecodedIdToken>
}

export class AdminAuthenticationError extends Error {
  constructor() {
    super('The administrator session is invalid or expired.')
    this.name = 'AdminAuthenticationError'
  }
}

export class AdminAuthorizationError extends Error {
  constructor() {
    super('This account does not have administrator access.')
    this.name = 'AdminAuthorizationError'
  }
}

type AdministratorIdentity = {
  uid: string
  admin?: unknown
  customClaims?: Record<string, unknown>
}

export function hasAdministratorAccess(
  identity: AdministratorIdentity,
  environment: NodeJS.ProcessEnv = process.env,
) {
  const bootstrapUid = environment.FIREBASE_BOOTSTRAP_ADMIN_UID?.trim()
  return identity.admin === true ||
    identity.customClaims?.admin === true ||
    Boolean(bootstrapUid && identity.uid === bootstrapUid)
}

export async function authenticateAdminRequest(
  request: Request,
  dependencies: AdminAuthenticationDependencies = {},
) {
  const token = parseBearerToken(request.headers.get('authorization'))
  if (!token) throw new AdminAuthenticationError()

  let identity: DecodedIdToken
  try {
    identity = await (dependencies.verifyIdToken ?? verifyFirebaseIdToken)(
      token,
      dependencies.environment,
    )
  } catch {
    throw new AdminAuthenticationError()
  }

  if (!hasAdministratorAccess(identity, dependencies.environment ?? process.env)) {
    throw new AdminAuthorizationError()
  }
  return identity
}
