import { describe, expect, it } from "vitest";
import { getAuthenticationErrorMessage } from "./authErrors";
import { loginSchema } from "./authSchema";

describe("loginSchema", () => {
  it("accepts a valid administrator credential shape", () => {
    expect(
      loginSchema.parse({ email: "admin@cpsu.edu.ph", password: "secret" }),
    ).toEqual({ email: "admin@cpsu.edu.ph", password: "secret" });
  });
  it("rejects malformed email addresses and empty passwords", () => {
    expect(
      loginSchema.safeParse({ email: "admin", password: "" }).success,
    ).toBe(false);
  });
});

describe("getAuthenticationErrorMessage", () => {
  it("maps provider errors to safe user-facing messages", () => {
    expect(
      getAuthenticationErrorMessage({ code: "auth/invalid-credential" }),
    ).toBe("The email address or password is incorrect.");
  });
  it("does not expose unknown provider messages", () => {
    expect(
      getAuthenticationErrorMessage(new Error("private provider detail")),
    ).toBe("Authentication was unsuccessful. Please try again.");
  });
});
