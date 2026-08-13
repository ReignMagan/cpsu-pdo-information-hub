import { z } from "zod";
export const structureItemIdSchema = z
  .string()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u);
export const managedCategorySchema = z.object({
  id: structureItemIdSchema,
  title: z.string().trim().min(2).max(100),
});
export const managedSectionSchema = z.object({
  id: structureItemIdSchema,
  title: z.string().trim().min(2).max(100),
  categories: z.array(managedCategorySchema),
});
export const repositoryStructureSchema = z.object({
  data: z.array(managedSectionSchema),
});
export const structureMutationSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("add-section"),
    title: z.string().trim().min(2).max(100),
  }),
  z.object({
    action: z.literal("rename-section"),
    id: structureItemIdSchema,
    title: z.string().trim().min(2).max(100),
  }),
  z.object({ action: z.literal("delete-section"), id: structureItemIdSchema }),
  z.object({
    action: z.literal("add-category"),
    sectionId: structureItemIdSchema,
    title: z.string().trim().min(2).max(100),
  }),
  z.object({
    action: z.literal("rename-category"),
    sectionId: structureItemIdSchema,
    id: structureItemIdSchema,
    title: z.string().trim().min(2).max(100),
  }),
  z.object({
    action: z.literal("delete-category"),
    sectionId: structureItemIdSchema,
    id: structureItemIdSchema,
  }),
]);
export type ManagedSection = z.infer<typeof managedSectionSchema>;
