import { handleAdminResourcesRequest } from '../../server/http/adminResourcesHandler.ts'

export default {
  fetch(request: Request) {
    return handleAdminResourcesRequest(request)
  },
}
