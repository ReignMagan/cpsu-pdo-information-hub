import { describe, expect, it } from "vitest";
import {
  resourceUploadCompletionRequestSchema,
  resourceUploadRequestSchema,
} from "./resourceUpload";

const baseRequest = {
  filename: "annual-report-2026.pdf",
  sectionId: "planning-documents",
  categoryId: "planning-documents",
  year: 2026,
  mimeType: "application/pdf",
  fileSize: 1024,
};

describe("resource upload file restrictions", () => {
  it.each([
    ["annual-report-2026.pdf", "application/pdf"],
    ["campus.jpg", "image/jpeg"],
    ["campus.png", "image/png"],
    ["campus.webp", "image/webp"],
  ])("accepts %s uploads", (filename, mimeType) => {
    expect(
      resourceUploadRequestSchema.safeParse({
        ...baseRequest,
        filename,
        mimeType,
      }).success,
    ).toBe(true);
  });

  it("rejects Excel upload authorization metadata", () => {
    expect(
      resourceUploadRequestSchema.safeParse({
        ...baseRequest,
        filename: "statistics.xlsx",
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }).success,
    ).toBe(false);
  });

  it("rejects Excel upload completion metadata", () => {
    expect(
      resourceUploadCompletionRequestSchema.safeParse({
        key: "planning-documents/2026/statistics.xlsx",
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        fileSize: 1024,
      }).success,
    ).toBe(false);
  });
});
