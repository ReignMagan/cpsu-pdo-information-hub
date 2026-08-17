import { describe, expect, it } from "vitest";
import { formatResourceFileType } from "./formatResourceFileType";

describe("formatResourceFileType", () => {
  it("uses specific labels for previewable resources", () => {
    expect(formatResourceFileType("pdf")).toBe("PDF");
    expect(formatResourceFileType("image")).toBe("Image");
  });

  it("uses a generic label for a legacy workbook", () => {
    expect(formatResourceFileType("xlsx")).toBe("File");
  });
});
