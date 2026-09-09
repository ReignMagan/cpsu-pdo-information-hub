import { describe, expect, it } from "vitest";
import { accomplishmentResourceDataSchema } from "./accomplishmentResource";

const nodes = [
  {
    id: "performance",
    parentId: null,
    type: "section" as const,
    title: "Performance",
  },
  {
    id: "education",
    parentId: "performance",
    type: "group" as const,
    title: "Education",
  },
  {
    id: "completion-rate",
    parentId: "education",
    type: "indicator" as const,
    title: "Completion rate",
  },
];

describe("accomplishment resource contract", () => {
  it("accepts quarterly target and accomplishment values", () => {
    const period = { q1: "1", q2: "2", q3: "3", q4: "4", total: "10" };
    const data = {
      version: 2 as const,
      nodes,
      entries: {
        "2026": {
          "completion-rate": {
            results: { target: period, accomplishment: period },
            rawData: { target: period, accomplishment: period },
          },
        },
      },
      chartType: "column" as const,
    };

    expect(accomplishmentResourceDataSchema.parse(data)).toEqual(data);
  });

  it("migrates a legacy annual target into Target Total", () => {
    const migrated = accomplishmentResourceDataSchema.parse({
      version: 1,
      nodes,
      entries: {
        "2026": {
          "completion-rate": {
            results: {
              target: "90%",
              q1: "88%",
              q2: "89%",
              q3: "",
              q4: "",
              total: "89%",
            },
            rawData: {
              target: "100",
              q1: "88",
              q2: "89",
              q3: "",
              q4: "",
              total: "89",
            },
          },
        },
      },
      chartType: "line",
    });

    expect(migrated.version).toBe(2);
    expect(migrated.entries["2026"]["completion-rate"].results).toEqual({
      target: { q1: "", q2: "", q3: "", q4: "", total: "90%" },
      accomplishment: {
        q1: "88%",
        q2: "89%",
        q3: "",
        q4: "",
        total: "89%",
      },
    });
  });
});
