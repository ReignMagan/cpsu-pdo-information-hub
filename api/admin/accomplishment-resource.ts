import { handleAccomplishmentResourceRequest } from "../../server/http/accomplishmentResourceHandler.ts";

export default {
  fetch(request: Request) {
    return handleAccomplishmentResourceRequest(request);
  },
};
