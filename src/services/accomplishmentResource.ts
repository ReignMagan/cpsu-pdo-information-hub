import type { User } from "firebase/auth";
import {
  accomplishmentResourceResponseSchema,
  type AccomplishmentResourceData,
} from "../contracts/accomplishmentResource";

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
