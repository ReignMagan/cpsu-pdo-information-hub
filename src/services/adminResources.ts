import type { User } from "firebase/auth";
import {
  adminResourceListResponseSchema,
  type AdminResourceListResponse,
  type ResourceQuery,
} from "../contracts/resource";
import { parseApiError, readJsonResponse } from "./apiResponse";
import { RepositoryApiError } from "./resources";

export async function getAdminResources(
  user: User,
  query: Partial<ResourceQuery> = {},
  signal?: AbortSignal,
): Promise<AdminResourceListResponse> {
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
  const payload = await readJsonResponse(response);

  if (!response.ok) {
    const error = parseApiError(
      payload,
      "The administrator resource request failed.",
    );
    throw new RepositoryApiError(error.message, error.code, response.status);
  }

  return adminResourceListResponseSchema.parse(payload);
}
