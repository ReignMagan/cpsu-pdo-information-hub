import { describe, expect, it } from "vitest";
import type { Resource } from "../../contracts/resource";
import { groupResourcesByCategory } from "./groupResourcesByCategory";

const resource = (overrides: Partial<Resource> = {}): Resource => ({
  key: "statistical-profile/student-population/2026/Original Report FINAL.pdf",
  filename: "Original Report FINAL.pdf",
  displayName: "Original report final",
  sectionId: "statistical-profile",
  categoryId: "student-population",
  year: 2026,
  fileType: "pdf",
  mimeType: "application/pdf",
  fileSize: 2_048,
  uploadedAt: "2026-08-12T06:02:16.467Z",
  downloadUrl: "https://example.com/Original%20Report%20FINAL.pdf",
  previewUrl: "https://example.com/Original%20Report%20FINAL.pdf",
  ...overrides,
});

describe("groupResourcesByCategory", () => {
  it("uses configured category titles while preserving original resource filenames", () => {
    const groups = groupResourcesByCategory([resource()]);

    expect(groups).toHaveLength(1);
    expect(groups[0]).toMatchObject({
      categoryTitle: "Student Population",
      sectionTitle: "Statistical Profile",
    });
    expect(groups[0].resources[0].filename).toBe("Original Report FINAL.pdf");
  });

  it("keeps resources in the same category together and orders categories institutionally", () => {
    const groups = groupResourcesByCategory([
      resource({
        key: "higher-education-performance/accreditation/2026/accreditation.pdf",
        filename: "accreditation.pdf",
        sectionId: "higher-education-performance",
        categoryId: "accreditation",
      }),
      resource(),
      resource({
        key: "statistical-profile/student-population/2025/student-population-2025.pdf",
        filename: "student-population-2025.pdf",
        year: 2025,
      }),
    ]);

    expect(groups.map((group) => group.categoryTitle)).toEqual([
      "Student Population",
      "Accreditation",
    ]);
    expect(groups[0].resources).toHaveLength(2);
  });

  it("groups files without a category under Section files", () => {
    const groups = groupResourcesByCategory([
      resource({
        key: "statistical-profile/2025-2026/Office Report.pdf",
        filename: "Office Report.pdf",
        categoryId: undefined,
        year: "2025-2026",
      }),
    ]);
    expect(groups[0]).toMatchObject({ categoryTitle: "Section files", sectionTitle: "Statistical Profile" });
  });
});
