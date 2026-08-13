import type { DecodedIdToken } from 'firebase-admin/auth'
import { AdminAuthenticationError, AdminAuthorizationError, authenticateAdminRequest } from '../auth/authenticateAdminRequest.ts'
import type { ListResourcesDependencies } from '../repository/listResources.ts'
import { handleResourcesRequest } from './resourcesHandler.ts'

type AdminResourcesDependencies = {
  environment?: NodeJS.ProcessEnv
  verifyIdToken?: (
    token: string,
    environment?: NodeJS.ProcessEnv,
  ) => Promise<DecodedIdToken>
  resources?: ListResourcesDependencies
}

const privateJsonHeaders = {
  'cache-control': 'private, no-store',
  'content-type': 'application/json; charset=utf-8',
}

function unauthorizedResponse(message: string) {
  return new Response(
    JSON.stringify({ error: { code: 'UNAUTHORIZED', message } }),
    { status: 401, headers: privateJsonHeaders },
  )
}

export async function handleAdminResourcesRequest(
  request: Request,
  dependencies: AdminResourcesDependencies = {},
) {
  try {
    const identity = await authenticateAdminRequest(request, dependencies)
    if (!identity.email) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'FORBIDDEN',
            message: 'An authorized administrator email is required.',
          },
        }),
        { status: 403, headers: privateJsonHeaders },
      )
    }
  } catch (error) {
    if (error instanceof AdminAuthorizationError) {
      return new Response(
        JSON.stringify({ error: { code: 'FORBIDDEN', message: error.message } }),
        { status: 403, headers: privateJsonHeaders },
      )
    }
    return unauthorizedResponse(
      error instanceof AdminAuthenticationError
        ? error.message
        : 'The administrator session is invalid or expired.',
    )
  }

  const resourceResponse = await handleResourcesRequest(request, {
    environment: dependencies.environment,
    ...dependencies.resources,
  })
  const headers = new Headers(resourceResponse.headers)
  headers.set('cache-control', 'private, no-store')
  return new Response(resourceResponse.body, {
    status: resourceResponse.status,
    statusText: resourceResponse.statusText,
    headers,
  })
}
