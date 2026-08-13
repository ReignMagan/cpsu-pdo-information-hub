import type { IncomingMessage } from 'node:http'
import type { Plugin } from 'vite'
import { handleUploadAuthorizeRequest } from '../http/uploadAuthorizeHandler.ts'

async function readBody(request: IncomingMessage) {
  const chunks: Uint8Array[] = []
  for await (const chunk of request) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  return Buffer.concat(chunks).toString('utf8')
}

export function uploadAuthorizeApiPlugin(environment: NodeJS.ProcessEnv): Plugin {
  return { name: 'cpsu-upload-authorize-api', configureServer(server) {
    server.middlewares.use(async (request, response, next) => {
      if (!request.url || new URL(request.url, 'http://localhost').pathname !== '/api/admin/resources/upload-authorize') { next(); return }
      const headers = new Headers()
      for (const [name, value] of Object.entries(request.headers)) {
        if (typeof value === 'string') headers.set(name, value)
        else if (value) value.forEach((item) => headers.append(name, item))
      }
      const apiResponse = await handleUploadAuthorizeRequest(new Request(`http://localhost${request.url}`, {
        method: request.method,
        headers,
        body: request.method === 'POST' ? await readBody(request) : undefined,
      }), { environment })
      response.statusCode = apiResponse.status
      apiResponse.headers.forEach((value, name) => response.setHeader(name, value))
      response.end(await apiResponse.text())
    })
  } }
}
