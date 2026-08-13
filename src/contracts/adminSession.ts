import { z } from "zod";

export const adminSessionSchema = z.object({
  data: z.object({
    uid: z.string().min(1),
    email: z.string().email(),
  }),
});

export type AdminSession = z.infer<typeof adminSessionSchema>["data"];
