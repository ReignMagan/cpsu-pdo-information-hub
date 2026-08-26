import type { IncomingMessage, ServerResponse } from "node:http";

function requestHeaders(request: IncomingMessage) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(request.headers)) {
    if (typeof value === "string") headers.set(name, value);
    else value?.forEach((item) => headers.append(name, item));
  }
  return headers;
}

async function requestBody(request: IncomingMessage) {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return chunks.length ? Buffer.concat(chunks) : undefined;
}

export async function createDevRequest(request: IncomingMessage) {
  const method = request.method ?? "GET";
  return new Request(`http://localhost${request.url ?? "/"}`, {
    method,
    headers: requestHeaders(request),
    body:
      method === "GET" || method === "HEAD"
        ? undefined
        : await requestBody(request),
  });
}

export async function writeDevResponse(
  response: ServerResponse,
  apiResponse: Response,
) {
  response.statusCode = apiResponse.status;
  apiResponse.headers.forEach((value, name) => response.setHeader(name, value));
  response.end(await apiResponse.text());
}
