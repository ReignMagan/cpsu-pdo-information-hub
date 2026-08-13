import type { Plugin } from 'vite'
import { handleResourcesRequest } from '../http/resourcesHandler.ts'

export function resourcesApiPlugin(environment: NodeJS.ProcessEnv): Plugin {
  return {
    name: 'cpsu-resources-api',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (!request.url?.startsWith('/api/resources')) {
          next()
          return
        }

        const apiResponse = await handleResourcesRequest(
          new Request(`http://localhost${request.url}`, { method: request.method }),
          { environment },
        )

        response.statusCode = apiResponse.status
        apiResponse.headers.forEach((value, name) => response.setHeader(name, value))
        response.end(await apiResponse.text())
      })
    },
  }
}
