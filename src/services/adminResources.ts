import type { User } from "firebase/auth";
import {
  apiErrorResponseSchema,
  resourceListResponseSchema,
  type ResourceListResponse,
  type ResourceQuery,
} from "../contracts/resource";
import { RepositoryApiError } from "./resources";

export async function getAdminResources(
  user: User,
  query: Partial<ResourceQuery> = {},
  signal?: AbortSignal,
): Promise<ResourceListResponse> {
  const searchParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "")
      searchParams.set(key, String(value));
  });

  const idToken = await user.getIdToken();
  const queryString = searchParams.toString();
  const response = await fetch(
    `/api/admin/resources${queryString ? `?${queryString}` : ""}`,
    {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${idToken}`,
      },
      signal,
    },
  );
  const payload: unknown = await response.json();

  if (!response.ok) {
    const error = apiErrorResponseSchema.safeParse(payload);
    throw new RepositoryApiError(
      error.success
        ? error.data.error.message
        : "The administrator resource request failed.",
      error.success ? error.data.error.code : "UNKNOWN_ERROR",
      response.status,
    );
  }

  return resourceListResponseSchema.parse(payload);
}
