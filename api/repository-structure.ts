import { handleRepositoryStructureRequest } from '../server/http/repositoryStructureHandler.ts'
export default { fetch(request: Request) { return handleRepositoryStructureRequest(request) } }
