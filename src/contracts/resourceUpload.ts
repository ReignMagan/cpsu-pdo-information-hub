import { z } from "zod";
import {
  repositorySectionIdSchema,
  resourceFilenameSchema,
  resourceYearSchema,
} from "./resource.ts";

export const maximumResourceFileSize = 25 * 1024 * 1024;

export const resourceUploadFileExtensions = [
  "pdf",
  "jpg",
  "jpeg",
  "png",
  "webp",
] as const;

export const resourceUploadFileDefinitions = {
  pdf: { mimeType: "application/pdf" },
  jpg: { mimeType: "image/jpeg" },
  jpeg: { mimeType: "image/jpeg" },
  png: { mimeType: "image/png" },
  webp: { mimeType: "image/webp" },
} as const;

export const resourceUploadMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const resourceUploadMimeTypeSchema = z.enum(resourceUploadMimeTypes);

export const resourceUploadRequestSchema = z.object({
  filename: resourceFilenameSchema,
  sectionId: repositorySectionIdSchema,
  categoryId: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u)
    .optional(),
  year: resourceYearSchema,
  mimeType: resourceUploadMimeTypeSchema,
  fileSize: z.number().int().positive().max(maximumResourceFileSize),
});

export const resourceUploadAuthorizationSchema = z.object({
  data: z.object({
    key: z.string().min(1),
    uploadUrl: z.url(),
    expiresInSeconds: z.number().int().positive(),
    headers: z.object({
      "content-type": z.string().min(1),
      "if-none-match": z.literal("*"),
    }),
  }),
});

export type ResourceUploadRequest = z.infer<typeof resourceUploadRequestSchema>;
export type ResourceUploadFileExtension =
  keyof typeof resourceUploadFileDefinitions;
export type ResourceUploadAuthorization = z.infer<
  typeof resourceUploadAuthorizationSchema
>["data"];

export const resourceUploadCompletionRequestSchema = z.object({
  key: z.string().min(1).max(1024),
  mimeType: resourceUploadMimeTypeSchema,
  fileSize: z.number().int().positive().max(maximumResourceFileSize),
});

export const resourceUploadCompletionResponseSchema = z.object({
  data: z.object({
    key: z.string().min(1),
    mimeType: z.string().min(1),
    fileSize: z.number().int().positive(),
    uploadedAt: z.iso.datetime({ offset: true }),
  }),
});

export type ResourceUploadCompletionRequest = z.infer<
  typeof resourceUploadCompletionRequestSchema
>;
