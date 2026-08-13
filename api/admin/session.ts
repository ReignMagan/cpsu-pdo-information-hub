import { handleAdminSessionRequest } from '../../server/http/adminSessionHandler.ts'

export default {
  fetch(request: Request) {
    return handleAdminSessionRequest(request)
  },
}
