import { handleUploadAuthorizeRequest } from '../../../server/http/uploadAuthorizeHandler.ts'

export default { fetch(request: Request) { return handleUploadAuthorizeRequest(request) } }
