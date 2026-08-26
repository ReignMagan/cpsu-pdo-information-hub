import type { Plugin } from "vite";
import { handleUploadAuthorizeRequest } from "../http/uploadAuthorizeHandler.ts";
import { createDevRequest, writeDevResponse } from "./httpAdapter.ts";

export function uploadAuthorizeApiPlugin(
  environment: NodeJS.ProcessEnv,
): Plugin {
  return {
    name: "cpsu-upload-authorize-api",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (
          !request.url ||
          new URL(request.url, "http://localhost").pathname !==
            "/api/admin/resources/upload-authorize"
        ) {
          next();
          return;
        }
        const apiResponse = await handleUploadAuthorizeRequest(
          await createDevRequest(request),
          { environment },
        );
        await writeDevResponse(response, apiResponse);
      });
    },
  };
}
