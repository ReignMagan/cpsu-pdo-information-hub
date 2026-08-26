import { apiErrorResponseSchema } from "../contracts/resource";

export async function readJsonResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

export function parseApiError(payload: unknown, fallbackMessage: string) {
  const result = apiErrorResponseSchema.safeParse(payload);
  return {
    code: result.success ? result.data.error.code : "UNKNOWN_ERROR",
    message: result.success ? result.data.error.message : fallbackMessage,
  };
}
