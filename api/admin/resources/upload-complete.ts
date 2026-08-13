import { handleUploadCompleteRequest } from '../../../server/http/uploadCompleteHandler.ts'

export default { fetch(request: Request) { return handleUploadCompleteRequest(request) } }
