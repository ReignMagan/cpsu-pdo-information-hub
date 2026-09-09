import { accomplishmentResourceDataSchema } from "../../src/contracts/accomplishmentResource.ts";
import {
  AdminAuthorizationError,
  authenticateAdminRequest,
} from "../auth/authenticateAdminRequest.ts";
import {
  readAccomplishmentResource,
  writeAccomplishmentResource,
} from "../repository/accomplishmentResourceStore.ts";
import { recordAuditEvent } from "../security/auditLog.ts";

const headers = {
  "cache-control": "private, no-store",
  "content-type": "application/json; charset=utf-8",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers });

type Dependencies = {
  audit?: typeof recordAuditEvent;
};

export async function handleAccomplishmentResourceRequest(
  request: Request,
  environment: NodeJS.ProcessEnv = process.env,
  dependencies: Dependencies = {},
) {
  let identity;
  try {
    identity = await authenticateAdminRequest(request, { environment });
  } catch (error) {
    if (error instanceof AdminAuthorizationError)
      return json(
        { error: { code: "FORBIDDEN", message: error.message } },
        403,
      );
    return json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication is required.",
        },
      },
      401,
    );
  }

  try {
    if (request.method === "GET")
      return json({ data: await readAccomplishmentResource(environment) });
    if (request.method !== "PUT")
      return json(
        {
          error: {
            code: "METHOD_NOT_ALLOWED",
            message: "Only GET and PUT are supported.",
          },
        },
        405,
      );

    const payload: unknown = await request.json();
    const parsed = accomplishmentResourceDataSchema.safeParse(payload);
    if (!parsed.success)
      return json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: "The accomplishment resource data is invalid.",
          },
        },
        400,
      );

    await (dependencies.audit ?? recordAuditEvent)(
      {
        action: "accomplishment-resource.saved",
        actor: identity,
        target: "accomplishment-resource",
        outcome: "attempted",
      },
      environment,
    );
    return json({
      data: await writeAccomplishmentResource(parsed.data, environment),
    });
  } catch {
    return json(
      {
        error: {
          code: "ACCOMPLISHMENT_RESOURCE_UNAVAILABLE",
          message: "The accomplishment resource could not be saved.",
        },
      },
      503,
    );
  }
}
