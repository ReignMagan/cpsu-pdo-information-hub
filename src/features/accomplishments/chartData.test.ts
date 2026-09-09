import { describe, expect, it } from "vitest";
import {
  annualComparisonFields,
  createComparisonChartData,
  getComparisonScaleMax,
  parseAccomplishmentNumber,
  quarterlyComparisonFields,
} from "./chartData";

const target = { q1: "80", q2: "80", q3: "", q4: "90", total: "85" };
const accomplishment = {
  q1: "90%",
  q2: "70",
  q3: "75",
  q4: "90",
  total: "88",
};

describe("accomplishment chart data", () => {
  it("parses numbers, percentages, decimals, and grouped values", () => {
    expect(parseAccomplishmentNumber("90%")).toBe(90);
    expect(parseAccomplishmentNumber("1,234.5")).toBe(1234.5);
    expect(parseAccomplishmentNumber("not reported")).toBeNull();
    expect(parseAccomplishmentNumber("-2")).toBeNull();
  });

  it("compares each quarterly accomplishment with its matching target", () => {
    const data = createComparisonChartData(
      target,
      accomplishment,
      quarterlyComparisonFields,
    );

    expect(data.map((item) => item.status)).toEqual([
      "met",
      "below",
      "unavailable",
      "met",
    ]);
    expect(data[0]).toMatchObject({
      targetNumeric: 80,
      accomplishmentDisplay: "90%",
      accomplishmentNumeric: 90,
    });
    expect(getComparisonScaleMax(data)).toBe(90);
  });

  it("uses the saved totals for the annual comparison", () => {
    const [annual] = createComparisonChartData(
      target,
      accomplishment,
      annualComparisonFields,
    );

    expect(annual).toMatchObject({
      label: "Annual",
      targetNumeric: 85,
      accomplishmentNumeric: 88,
      status: "met",
    });
  });
});
