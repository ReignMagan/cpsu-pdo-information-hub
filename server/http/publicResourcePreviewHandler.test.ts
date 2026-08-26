import type { GetObjectCommand } from "@aws-sdk/client-s3";
import { describe, expect, it, vi } from "vitest";
import { handlePublicResourcePreviewRequest } from "./publicResourcePreviewHandler";

const resourceId = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
const config = {
  accountId: "test-account",
  accessKeyId: "test-access-key",
  secretAccessKey: "test-secret-key",
  bucketName: "test-bucket",
  endpoint: "https://test-account.r2.cloudflarestorage.com",
};
const pdfResource = {
  id: resourceId,
  key: "planning-documents/annual-reports/2026/annual-report-2026.pdf",
  filename: "annual-report-2026.pdf",
  displayName: "Annual Report 2026",
  sectionId: "planning-documents",
  categoryId: "annual-reports",
  year: 2026,
  fileType: "pdf" as const,
  mimeType: "application/pdf",
  fileSize: 4096,
  uploadedAt: "2026-08-12T08:00:00.000Z",
};

function request(body: unknown) {
  return new Request("http://localhost/api/resource-preview", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("handlePublicResourcePreviewRequest", () => {
  it("returns a short-lived inline preview without exposing the object key", async () => {
    const sign = vi.fn(async (command: GetObjectCommand, expiresIn: number) => {
      void command;
      void expiresIn;
      return "https://signed.example/preview";
    });
    const response = await handlePublicResourcePreviewRequest(
      request({ id: resourceId }),
      {
        config,
        findResource: async () => pdfResource,
        now: () => new Date("2026-08-12T08:00:00.000Z"),
        sign,
      },
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(body).toEqual({
      data: {
        url: "https://signed.example/preview",
        expiresAt: "2026-08-12T08:01:00.000Z",
      },
    });
    expect(JSON.stringify(body)).not.toContain(pdfResource.key);
    expect(sign).toHaveBeenCalledWith(expect.anything(), 60);
    const commandInput = sign.mock.calls[0]?.[0].input;
    expect(commandInput).toMatchObject({
      Bucket: "test-bucket",
      Key: pdfResource.key,
      ResponseContentDisposition: expect.stringContaining("inline"),
    });
  });

  it("rejects spreadsheet previews", async () => {
    const response = await handlePublicResourcePreviewRequest(
      request({ id: resourceId }),
      {
        config,
        findResource: async () => ({
          ...pdfResource,
          key: "planning-documents/data/2026/data.xlsx",
          filename: "data.xlsx",
          fileType: "xlsx",
          mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      },
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: "RESOURCE_NOT_PREVIEWABLE" },
    });
  });

  it("returns not found for an unknown opaque resource id", async () => {
    const response = await handlePublicResourcePreviewRequest(
      request({ id: resourceId }),
      { config, findResource: async () => null },
    );

    expect(response.status).toBe(404);
  });

  it("rejects malformed identifiers without resolving repository objects", async () => {
    const findResource = vi.fn();
    const response = await handlePublicResourcePreviewRequest(
      request({ id: "../../private.pdf" }),
      { config, findResource },
    );

    expect(response.status).toBe(400);
    expect(findResource).not.toHaveBeenCalled();
  });
});
