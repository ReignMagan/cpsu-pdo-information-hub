import { handlePublicAccomplishmentResourceRequest } from "../server/http/publicAccomplishmentResourceHandler.ts";

export default {
  fetch(request: Request) {
    return handlePublicAccomplishmentResourceRequest(request);
  },
};
