import {
  apiErrorResponseSchema,
  resourceListResponseSchema,
  type ResourceListResponse,
  type ResourceQuery,
} from "../contracts/resource";

export class RepositoryApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "RepositoryApiError";
    this.code = code;
    this.status = status;
  }
}

export async function getResources(
  query: Partial<ResourceQuery> = {},
  signal?: AbortSignal,
): Promise<ResourceListResponse> {
  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "")
      searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();
  const response = await fetch(
    `/api/resources${queryString ? `?${queryString}` : ""}`,
    {
      headers: { accept: "application/json" },
      signal,
    },
  );
  const payload: unknown = await response.json();

  if (!response.ok) {
    const error = apiErrorResponseSchema.safeParse(payload);
    throw new RepositoryApiError(
      error.success
        ? error.data.error.message
        : "The repository request failed.",
      error.success ? error.data.error.code : "UNKNOWN_ERROR",
      response.status,
    );
  }

  return resourceListResponseSchema.parse(payload);
}
