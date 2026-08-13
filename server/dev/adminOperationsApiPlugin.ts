import type { IncomingMessage } from 'node:http'
import type { Plugin } from 'vite'
import { handleAdminResourceMutationRequest } from '../http/adminResourceMutationHandler.ts'
import { handleAdminUsersRequest } from '../http/adminUsersHandler.ts'
import { handleAdminRepositoryStructureRequest, handleRepositoryStructureRequest } from '../http/repositoryStructureHandler.ts'

function headersFrom(request: IncomingMessage) { const headers = new Headers(); for (const [name, value] of Object.entries(request.headers)) { if (typeof value === 'string') headers.set(name, value); else value?.forEach((item) => headers.append(name, item)) } return headers }
async function bodyFrom(request: IncomingMessage) { const chunks: Buffer[] = []; for await (const chunk of request) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)); return chunks.length ? Buffer.concat(chunks) : undefined }
export function adminOperationsApiPlugin(environment: NodeJS.ProcessEnv): Plugin { return { name: 'cpsu-admin-operations-api', configureServer(server) { server.middlewares.use(async (request, response, next) => {
  if (!request.url) return next()
  const path = new URL(request.url, 'http://localhost').pathname
  const handler = path === '/api/admin/resource' ? handleAdminResourceMutationRequest : path === '/api/admin/users' ? handleAdminUsersRequest : null
  if (path === '/api/repository-structure') { const apiResponse = await handleRepositoryStructureRequest(new Request(`http://localhost${request.url}`, { method: request.method }), environment); response.statusCode = apiResponse.status; apiResponse.headers.forEach((value, name) => response.setHeader(name, value)); response.end(await apiResponse.text()); return }
  if (path === '/api/admin/repository-structure') { const apiResponse = await handleAdminRepositoryStructureRequest(new Request(`http://localhost${request.url}`, { method: request.method, headers: headersFrom(request), body: request.method === 'GET' ? undefined : await bodyFrom(request) }), environment); response.statusCode = apiResponse.status; apiResponse.headers.forEach((value, name) => response.setHeader(name, value)); response.end(await apiResponse.text()); return }
  if (!handler) return next()
  const apiResponse = await handler(new Request(`http://localhost${request.url}`, { method: request.method, headers: headersFrom(request), body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await bodyFrom(request) }), { environment })
  response.statusCode = apiResponse.status; apiResponse.headers.forEach((value, name) => response.setHeader(name, value)); response.end(await apiResponse.text())
}) } } }
