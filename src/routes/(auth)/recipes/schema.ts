import { z } from "zod";

export const createRecipeSchema = z.object({
  title: z.string().min(1, { message: 'Required field' }).max(255).trim(),
  description: z.string().max(255).nullable(),
  body: z.string().nullable(),
  private: z.boolean(),
  level: z.string().nullable(),
});

export const updateRecipeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, { message: 'Required field' }).max(255).trim(),
  description: z.string().max(255).nullable(),
  body: z.string().nullable(),
  private: z.boolean(),
  level: z.string().nullable(),
});

export type CreateRecipeSchema = typeof createRecipeSchema;
export type UpdateRecipeSchema = typeof updateRecipeSchema;
