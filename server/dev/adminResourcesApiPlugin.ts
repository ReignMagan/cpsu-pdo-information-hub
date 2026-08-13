import type { IncomingMessage } from 'node:http'
import type { Plugin } from 'vite'
import { handleAdminResourcesRequest } from '../http/adminResourcesHandler.ts'

function requestHeaders(request: IncomingMessage) {
  const headers = new Headers()
  for (const [name, value] of Object.entries(request.headers)) {
    if (typeof value === 'string') headers.set(name, value)
    else if (value) value.forEach((item) => headers.append(name, item))
  }
  return headers
}

export function adminResourcesApiPlugin(environment: NodeJS.ProcessEnv): Plugin {
  return {
    name: 'cpsu-admin-resources-api',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (!request.url || new URL(request.url, 'http://localhost').pathname !== '/api/admin/resources') {
          next()
          return
        }

        const apiResponse = await handleAdminResourcesRequest(
          new Request(`http://localhost${request.url}`, {
            method: request.method,
            headers: requestHeaders(request),
          }),
          { environment },
        )
        response.statusCode = apiResponse.status
        apiResponse.headers.forEach((value, name) => response.setHeader(name, value))
        response.end(await apiResponse.text())
      })
    },
  }
}
