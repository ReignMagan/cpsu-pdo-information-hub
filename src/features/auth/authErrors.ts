const authenticationMessages: Readonly<Record<string, string>> = {
  "auth/invalid-credential": "The email address or password is incorrect.",
  "auth/invalid-email": "Enter a valid administrator email address.",
  "auth/too-many-requests":
    "Too many attempts were made. Wait a moment and try again.",
  "auth/network-request-failed":
    "The login service could not be reached. Check your connection and try again.",
  "auth/user-disabled": "This administrator account has been disabled.",
};

function hasErrorCode(error: unknown): error is { code: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  );
}

export function getAuthenticationErrorMessage(error: unknown) {
  if (hasErrorCode(error))
    return (
      authenticationMessages[error.code] ??
      "Authentication was unsuccessful. Please try again."
    );
  if (error instanceof Error && error.name === "FirebaseConfigurationError")
    return error.message;
  return "Authentication was unsuccessful. Please try again.";
}
