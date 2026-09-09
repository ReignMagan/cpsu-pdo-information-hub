import type { User } from "firebase/auth";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AdminSessionRequestError, fetchAdminSession } from "./adminSession";

const user = {
  getIdToken: vi.fn(async () => "firebase-token"),
} as unknown as User;

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchAdminSession", () => {
  it("preserves a forbidden response so the UI can show an approval error", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
      error: { code: "FORBIDDEN", message: "This account does not have administrator access." },
    }), { status: 403 })));

    const error = await fetchAdminSession(user).catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(AdminSessionRequestError);
    expect(error).toMatchObject({ code: "FORBIDDEN", status: 403 });
  });

  it("keeps authentication failures distinct from missing approval", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
      error: { code: "UNAUTHORIZED", message: "The administrator session is invalid or expired." },
    }), { status: 401 })));

    const error = await fetchAdminSession(user).catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(AdminSessionRequestError);
    expect(error).toMatchObject({ code: "UNAUTHORIZED", status: 401 });
  });
});
