import type { Plugin } from "vite";
import { handleAdminSessionRequest } from "../http/adminSessionHandler.ts";
import { createDevRequest, writeDevResponse } from "./httpAdapter.ts";

export function adminSessionApiPlugin(environment: NodeJS.ProcessEnv): Plugin {
  return {
    name: "cpsu-admin-session-api",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (!request.url?.startsWith("/api/admin/session")) {
          next();
          return;
        }

        const apiResponse = await handleAdminSessionRequest(
          await createDevRequest(request),
          { environment },
        );
        await writeDevResponse(response, apiResponse);
      });
    },
  };
}
