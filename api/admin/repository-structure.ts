import { handleAdminRepositoryStructureRequest } from '../../server/http/repositoryStructureHandler.ts'
export default { fetch(request: Request) { return handleAdminRepositoryStructureRequest(request) } }
