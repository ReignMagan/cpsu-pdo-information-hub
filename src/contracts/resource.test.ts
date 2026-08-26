import { describe, expect, it } from "vitest";
import {
  adminResourceSchema,
  publicResourceSchema,
  resourceQuerySchema,
} from "./resource";

const validMetadata = {
  id: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  filename: "student-population-2026.xlsx",
  displayName: "Student Population 2026",
  sectionId: "statistical-profile",
  categoryId: "student-population",
  year: 2026,
  fileType: "xlsx",
  mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  fileSize: 2048,
  uploadedAt: "2026-08-12T08:00:00.000Z",
};

const validKey =
  "statistical-profile/student-population/2026/student-population-2026.xlsx";

describe("resource contracts", () => {
  it("keeps storage keys and file URLs out of the public resource shape", () => {
    const parsed = publicResourceSchema.parse({
      ...validMetadata,
      key: validKey,
      downloadUrl: "https://resources.example.edu/private.xlsx",
      previewUrl: "https://resources.example.edu/private.xlsx",
    });

    expect(parsed).toEqual(validMetadata);
    expect(parsed).not.toHaveProperty("key");
    expect(parsed).not.toHaveProperty("downloadUrl");
    expect(parsed).not.toHaveProperty("previewUrl");
  });

  it("retains the storage key only in the administrator resource shape", () => {
    expect(
      adminResourceSchema.parse({ ...validMetadata, key: validKey }),
    ).toEqual({
      ...validMetadata,
      key: validKey,
    });
  });

  it("rejects traversal in R2 object keys", () => {
    expect(() =>
      adminResourceSchema.parse({
        ...validMetadata,
        key: "../../private.xlsx",
      }),
    ).toThrow();
  });

  it("rejects filenames containing path separators", () => {
    expect(() =>
      publicResourceSchema.parse({
        ...validMetadata,
        filename: "unsafe/file.xlsx",
      }),
    ).toThrow();
  });

  it("rejects deceptive Unicode formatting characters", () => {
    expect(() =>
      publicResourceSchema.parse({
        ...validMetadata,
        filename: "report\u202Efdp.xlsx",
      }),
    ).toThrow();
  });

  it("rejects compatibility characters and unsafe trailing characters", () => {
    expect(() =>
      publicResourceSchema.parse({
        ...validMetadata,
        filename: "report.xlsx ",
      }),
    ).toThrow();
    expect(() =>
      publicResourceSchema.parse({
        ...validMetadata,
        filename: "report\uFF0Exlsx",
      }),
    ).toThrow();
  });

  it("rejects a file type that does not match the filename extension", () => {
    expect(() =>
      publicResourceSchema.parse({ ...validMetadata, fileType: "pdf" }),
    ).toThrow();
  });

  it("rejects a MIME type that does not match the filename extension", () => {
    expect(() =>
      publicResourceSchema.parse({
        ...validMetadata,
        mimeType: "application/pdf",
      }),
    ).toThrow();
  });
});

describe("resourceQuerySchema", () => {
  it("applies deterministic list defaults", () => {
    expect(resourceQuerySchema.parse({})).toMatchObject({
      sort: "newest",
      limit: 50,
    });
  });

  it("coerces supported URL values", () => {
    expect(
      resourceQuerySchema.parse({ year: "2026", limit: "25" }),
    ).toMatchObject({
      year: 2026,
      limit: 25,
    });
  });

  it("rejects unsupported file types", () => {
    expect(resourceQuerySchema.safeParse({ fileType: "docx" }).success).toBe(
      false,
    );
  });
});
