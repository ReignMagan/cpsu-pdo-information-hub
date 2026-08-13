import type { User } from "firebase/auth";
import { apiErrorResponseSchema } from "../contracts/resource";
import {
  resourceUploadAuthorizationSchema,
  type ResourceUploadRequest,
} from "../contracts/resourceUpload";
import { resourceUploadCompletionResponseSchema } from "../contracts/resourceUpload";
import { RepositoryApiError } from "./resources";

export async function uploadResource(
  user: User,
  file: File,
  input: Omit<ResourceUploadRequest, "filename" | "mimeType" | "fileSize">,
) {
  const token = await user.getIdToken();
  const authorizationResponse = await fetch(
    "/api/admin/resources/upload-authorize",
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        ...input,
        filename: file.name,
        mimeType: file.type,
        fileSize: file.size,
      }),
    },
  );
  const payload: unknown = await authorizationResponse.json();
  if (!authorizationResponse.ok) {
    const error = apiErrorResponseSchema.safeParse(payload);
    throw new RepositoryApiError(
      error.success ? error.data.error.message : "The file could not be prepared for upload.",
      error.success ? error.data.error.code : "UNKNOWN_ERROR",
      authorizationResponse.status,
    );
  }
  const authorization = resourceUploadAuthorizationSchema.parse(payload).data;
  let uploadResponse: Response;
  try {
    uploadResponse = await fetch(authorization.uploadUrl, {
      method: "PUT",
      headers: authorization.headers,
      body: file,
    });
  } catch {
    throw new RepositoryApiError(
      "The file could not be uploaded. Please check your connection and try again.",
      "UPLOAD_NETWORK_FAILED",
      0,
    );
  }
  if (!uploadResponse.ok)
    throw new RepositoryApiError(
      "The file could not be uploaded. Please try again.",
      "UPLOAD_FAILED",
      uploadResponse.status,
    );
  const completionResponse = await fetch(
    "/api/admin/resources/upload-complete",
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        key: authorization.key,
        mimeType: file.type,
        fileSize: file.size,
      }),
    },
  );
  const completionPayload: unknown = await completionResponse.json();
  if (!completionResponse.ok) {
    const error = apiErrorResponseSchema.safeParse(completionPayload);
    throw new RepositoryApiError(
      error.success ? error.data.error.message : "The upload could not be completed.",
      error.success ? error.data.error.code : "UNKNOWN_ERROR",
      completionResponse.status,
    );
  }
  return resourceUploadCompletionResponseSchema.parse(completionPayload).data
    .key;
}
