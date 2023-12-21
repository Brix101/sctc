import * as z from "zod"

export const searchParamsSchema = z.object({
  page: z.string().default("1"),
  per_page: z.string().default("10"),
  from: z.string().optional(),
  to: z.string().optional(),
  sort: z.string().optional().default("createdAt.desc"),
})

export const dashboardTopicsSearchParamsSchema = searchParamsSchema.extend({
  name: z.string().optional(),
})
