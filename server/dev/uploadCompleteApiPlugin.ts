import type { Plugin } from "vite";
import { handleUploadCompleteRequest } from "../http/uploadCompleteHandler.ts";
import { createDevRequest, writeDevResponse } from "./httpAdapter.ts";

export function uploadCompleteApiPlugin(
  environment: NodeJS.ProcessEnv,
): Plugin {
  return {
    name: "cpsu-upload-complete-api",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (
          !request.url ||
          new URL(request.url, "http://localhost").pathname !==
            "/api/admin/resources/upload-complete"
        ) {
          next();
          return;
        }
        const apiResponse = await handleUploadCompleteRequest(
          await createDevRequest(request),
          { environment },
        );
        await writeDevResponse(response, apiResponse);
      });
    },
  };
}
