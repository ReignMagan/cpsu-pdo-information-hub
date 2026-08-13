import type { DecodedIdToken } from 'firebase-admin/auth'
import {
  AdminAuthenticationError,
  AdminAuthorizationError,
  authenticateAdminRequest,
} from '../auth/authenticateAdminRequest.ts'

const jsonHeaders: Record<string, string> = {
  'cache-control': 'no-store',
  'content-type': 'application/json; charset=utf-8',
}

type AdminSessionDependencies = {
  environment?: NodeJS.ProcessEnv
  verifyIdToken?: (
    token: string,
    environment?: NodeJS.ProcessEnv,
  ) => Promise<DecodedIdToken>
}

function jsonResponse(body: unknown, status = 200, headers = jsonHeaders) {
  return new Response(JSON.stringify(body), { status, headers })
}

export async function handleAdminSessionRequest(
  request: Request,
  dependencies: AdminSessionDependencies = {},
): Promise<Response> {
  if (request.method !== 'GET') {
    return jsonResponse(
      { error: { code: 'METHOD_NOT_ALLOWED', message: 'Only GET is supported.' } },
      405,
      { ...jsonHeaders, allow: 'GET' },
    )
  }

  try {
    const decodedToken = await authenticateAdminRequest(request, dependencies)

    if (!decodedToken.email) {
      return jsonResponse(
        { error: { code: 'FORBIDDEN', message: 'An authorized administrator email is required.' } },
        403,
      )
    }

    return jsonResponse({ data: { uid: decodedToken.uid, email: decodedToken.email } })
  } catch (error) {
    if (error instanceof AdminAuthorizationError) {
      return jsonResponse(
        { error: { code: 'FORBIDDEN', message: error.message } },
        403,
      )
    }
    return jsonResponse(
      {
        error: {
          code: 'UNAUTHORIZED',
          message: error instanceof AdminAuthenticationError
            ? error.message
            : 'The administrator session is invalid or expired.',
        },
      },
      401,
    )
  }
}
