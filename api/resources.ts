import { handleResourcesRequest } from '../server/http/resourcesHandler.ts'

export default {
  fetch(request: Request) {
    return handleResourcesRequest(request)
  },
}
