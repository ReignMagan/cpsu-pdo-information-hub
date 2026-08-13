import type { User } from "firebase/auth";
import { adminSessionSchema } from "../contracts/adminSession";

export class AdminSessionRequestError extends Error {
  constructor() {
    super("Your sign-in could not be confirmed. Please sign in again.");
    this.name = "AdminSessionRequestError";
  }
}

export async function fetchAdminSession(user: User) {
  const idToken = await user.getIdToken();
  const response = await fetch("/api/admin/session", {
    headers: { authorization: `Bearer ${idToken}` },
  });

  if (!response.ok) throw new AdminSessionRequestError();

  const result = adminSessionSchema.safeParse(await response.json());
  if (!result.success) throw new AdminSessionRequestError();
  return result.data.data;
}
