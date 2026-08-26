import { z } from 'zod';
import { resourceObjectKeySchema } from './resource.ts';

export const adminResourceAccessModeSchema = z.enum(['preview', 'download']);

export const adminResourceAccessRequestSchema = z.object({
  key: resourceObjectKeySchema,
  mode: adminResourceAccessModeSchema,
});

export const adminResourceAccessResponseSchema = z.object({
  data: z.object({
    url: z.url(),
    expiresAt: z.iso.datetime({ offset: true }),
  }),
});

export type AdminResourceAccessMode = z.infer<
  typeof adminResourceAccessModeSchema
>;
export type AdminResourceAccessResponse = z.infer<
  typeof adminResourceAccessResponseSchema
>;
