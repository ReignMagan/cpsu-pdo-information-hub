import type { AccomplishmentResourceData } from "../../src/contracts/accomplishmentResource.ts";
import { readAccomplishmentResource } from "../repository/accomplishmentResourceStore.ts";

const publicHeaders = {
  "cache-control": "no-store",
  "content-type": "application/json; charset=utf-8",
};

function json(
  body: unknown,
  status = 200,
  headers: Record<string, string> = publicHeaders,
) {
  return new Response(JSON.stringify(body), { status, headers });
}

type Dependencies = {
  read?: (
    environment?: NodeJS.ProcessEnv,
  ) => Promise<AccomplishmentResourceData>;
};

export async function handlePublicAccomplishmentResourceRequest(
  request: Request,
  environment: NodeJS.ProcessEnv = process.env,
  dependencies: Dependencies = {},
) {
  if (request.method !== "GET") {
    return json(
      {
        error: {
          code: "METHOD_NOT_ALLOWED",
          message: "Only GET is supported.",
        },
      },
      405,
      { ...publicHeaders, allow: "GET" },
    );
  }

  const year = new URL(request.url).searchParams.get("year");
  if (!year || !/^\d{4}$/u.test(year)) {
    return json(
      {
        error: {
          code: "INVALID_YEAR",
          message: "Select a valid year.",
        },
      },
      400,
    );
  }

  try {
    const data = await (dependencies.read ?? readAccomplishmentResource)(
      environment,
    );
    return json({
      data: {
        ...data,
        entries: { [year]: data.entries[year] ?? {} },
      },
    });
  } catch {
    return json(
      {
        error: {
          code: "ACCOMPLISHMENT_RESOURCE_UNAVAILABLE",
          message: "Accomplishment data is temporarily unavailable.",
        },
      },
      503,
      { ...publicHeaders, "cache-control": "no-store" },
    );
  }
}
