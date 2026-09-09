import { PutObjectCommand } from "@aws-sdk/client-s3";
import { describe, expect, it } from "vitest";
import { accomplishmentResourceDataSchema } from "../../src/contracts/accomplishmentResource.ts";
import { createAccomplishmentResourceWriteCommand } from "./accomplishmentResourceStore.ts";

const data = {
  version: 2 as const,
  nodes: [
    {
      id: "physical-performance",
      parentId: null,
      type: "section" as const,
      title: "Physical Performance",
    },
    {
      id: "higher-education",
      parentId: "physical-performance",
      type: "group" as const,
      title: "Higher Education",
    },
  ],
  entries: {},
  chartType: "column" as const,
};

describe("accomplishment resource storage", () => {
  it("validates a correctly nested worksheet", () => {
    expect(accomplishmentResourceDataSchema.parse(data)).toEqual(data);
  });

  it("rejects an orphaned performance group", () => {
    expect(() =>
      accomplishmentResourceDataSchema.parse({
        ...data,
        nodes: [{ ...data.nodes[1], parentId: "missing-section" }],
      }),
    ).toThrow();
  });

  it("writes the worksheet to the private system object", () => {
    const command = createAccomplishmentResourceWriteCommand(
      "repository",
      data,
    );
    expect(command).toBeInstanceOf(PutObjectCommand);
    expect(command.input).toMatchObject({
      Bucket: "repository",
      Key: "_system/accomplishment-resource.json",
      ContentType: "application/json",
      CacheControl: "no-store",
    });
  });
});
