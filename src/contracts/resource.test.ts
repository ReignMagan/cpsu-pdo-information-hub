import { describe, expect, it } from "vitest";
import { resourceQuerySchema, resourceSchema } from "./resource";

const validResource = {
  key: "statistical-profile/student-population/2026/student-population-2026.xlsx",
  filename: "student-population-2026.xlsx",
  displayName: "Student Population 2026",
  sectionId: "statistical-profile",
  categoryId: "student-population",
  year: 2026,
  fileType: "xlsx",
  mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  fileSize: 2048,
  uploadedAt: "2026-08-12T08:00:00.000Z",
  downloadUrl: "https://resources.example.edu/student-population-2026.xlsx",
};

describe("resourceSchema", () => {
  it("accepts one unified resource shape", () => {
    expect(resourceSchema.parse(validResource)).toEqual(validResource);
  });

  it("rejects traversal in R2 object keys", () => {
    expect(() =>
      resourceSchema.parse({ ...validResource, key: "../../private.xlsx" }),
    ).toThrow();
  });

  it("rejects filenames containing path separators", () => {
    expect(() =>
      resourceSchema.parse({ ...validResource, filename: "unsafe/file.xlsx" }),
    ).toThrow();
  });

  it("rejects deceptive Unicode formatting characters", () => {
    expect(() =>
      resourceSchema.parse({
        ...validResource,
        filename: "report\u202Efdp.xlsx",
      }),
    ).toThrow();
  });

  it("rejects compatibility characters and unsafe trailing characters", () => {
    expect(() =>
      resourceSchema.parse({ ...validResource, filename: "report.xlsx " }),
    ).toThrow();
    expect(() =>
      resourceSchema.parse({ ...validResource, filename: "report\uFF0Exlsx" }),
    ).toThrow();
  });

  it("rejects a file type that does not match the filename extension", () => {
    expect(() =>
      resourceSchema.parse({ ...validResource, fileType: "pdf" }),
    ).toThrow();
  });

  it("rejects a MIME type that does not match the filename extension", () => {
    expect(() =>
      resourceSchema.parse({ ...validResource, mimeType: "application/pdf" }),
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
