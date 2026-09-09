import type { User } from "firebase/auth";
import {
  accomplishmentResourceResponseSchema,
  type AccomplishmentResourceData,
} from "../contracts/accomplishmentResource";
import { parseApiError, readJsonResponse } from "./apiResponse";

async function request(
  user: User,
  init?: RequestInit,
): Promise<AccomplishmentResourceData> {
  const response = await fetch("/api/admin/accomplishment-resource", {
    ...init,
    headers: {
      authorization: `Bearer ${await user.getIdToken()}`,
      ...(init?.body ? { "content-type": "application/json" } : {}),
    },
  });
  const payload: unknown = await response.json();
  if (!response.ok)
    throw new Error(
      typeof payload === "object" &&
        payload &&
        "error" in payload &&
        typeof payload.error === "object" &&
        payload.error &&
        "message" in payload.error
        ? String(payload.error.message)
        : "The accomplishment resource request failed.",
    );
  return accomplishmentResourceResponseSchema.parse(payload).data;
}

export function getAccomplishmentResource(user: User) {
  return request(user);
}

export function saveAccomplishmentResource(
  user: User,
  data: AccomplishmentResourceData,
) {
  return request(user, { method: "PUT", body: JSON.stringify(data) });
}

export async function getPublicAccomplishmentResource(
  year: number,
  signal?: AbortSignal,
) {
  const response = await fetch(`/api/accomplishments?year=${year}`, {
    cache: "no-store",
    headers: { accept: "application/json" },
    signal,
  });
  const payload = await readJsonResponse(response);

  if (!response.ok) {
    const error = parseApiError(
      payload,
      "The accomplishment data could not be loaded.",
    );
    throw new Error(error.message);
  }

  return accomplishmentResourceResponseSchema.parse(payload).data;
}
