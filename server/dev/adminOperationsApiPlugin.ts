import type { Plugin } from "vite";
import { handleAdminResourceMutationRequest } from "../http/adminResourceMutationHandler.ts";
import { handleAdminUsersRequest } from "../http/adminUsersHandler.ts";
import {
  handleAdminRepositoryStructureRequest,
  handleRepositoryStructureRequest,
} from "../http/repositoryStructureHandler.ts";
import { handleAdminResourceAccessRequest } from "../http/adminResourceAccessHandler.ts";
import { createDevRequest, writeDevResponse } from "./httpAdapter.ts";
export function adminOperationsApiPlugin(
  environment: NodeJS.ProcessEnv,
): Plugin {
  return {
    name: "cpsu-admin-operations-api",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (!request.url) return next();
        const path = new URL(request.url, "http://localhost").pathname;
        const handler =
          path === "/api/admin/resource"
            ? handleAdminResourceMutationRequest
            : path === "/api/admin/resource-access"
              ? handleAdminResourceAccessRequest
              : path === "/api/admin/users"
                ? handleAdminUsersRequest
                : null;
        if (path === "/api/repository-structure") {
          const apiResponse = await handleRepositoryStructureRequest(
            await createDevRequest(request),
            environment,
          );
          await writeDevResponse(response, apiResponse);
          return;
        }
        if (path === "/api/admin/repository-structure") {
          const apiResponse = await handleAdminRepositoryStructureRequest(
            await createDevRequest(request),
            environment,
          );
          await writeDevResponse(response, apiResponse);
          return;
        }
        if (!handler) return next();
        const apiResponse = await handler(await createDevRequest(request), {
          environment,
        });
        await writeDevResponse(response, apiResponse);
      });
    },
  };
}
