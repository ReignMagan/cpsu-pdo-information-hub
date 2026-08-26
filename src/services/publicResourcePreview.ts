import { publicResourcePreviewResponseSchema } from "../contracts/publicResourcePreview";
import { RepositoryApiError } from "./resources";
import { parseApiError, readJsonResponse } from "./apiResponse";

export async function authorizePublicResourcePreview(id: string) {
  const response = await fetch("/api/resource-preview", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
  const payload = await readJsonResponse(response);

  if (!response.ok) {
    const error = parseApiError(
      payload,
      "The file preview could not be opened.",
    );
    throw new RepositoryApiError(error.message, error.code, response.status);
  }

  const result = publicResourcePreviewResponseSchema.safeParse(payload);
  if (!result.success) {
    throw new RepositoryApiError(
      "The preview response was not valid.",
      "INVALID_RESPONSE",
      response.status,
    );
  }

  const access = result.data.data;
  const accessUrl = new URL(access.url);
  const isLocalDevelopmentUrl =
    import.meta.env.DEV &&
    (accessUrl.hostname === "localhost" || accessUrl.hostname === "127.0.0.1");
  if (accessUrl.protocol !== "https:" && !isLocalDevelopmentUrl) {
    throw new RepositoryApiError(
      "The preview link was not secure.",
      "INSECURE_PREVIEW_URL",
      response.status,
    );
  }

  return access;
}
