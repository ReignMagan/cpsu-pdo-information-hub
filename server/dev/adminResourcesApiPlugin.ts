import type { Plugin } from "vite";
import { handleAdminResourcesRequest } from "../http/adminResourcesHandler.ts";
import { createDevRequest, writeDevResponse } from "./httpAdapter.ts";

export function adminResourcesApiPlugin(
  environment: NodeJS.ProcessEnv,
): Plugin {
  return {
    name: "cpsu-admin-resources-api",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (
          !request.url ||
          new URL(request.url, "http://localhost").pathname !==
            "/api/admin/resources"
        ) {
          next();
          return;
        }

        const apiResponse = await handleAdminResourcesRequest(
          await createDevRequest(request),
          { environment },
        );
        await writeDevResponse(response, apiResponse);
      });
    },
  };
}
