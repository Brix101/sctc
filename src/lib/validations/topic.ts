import * as z from "zod"

export const topicSchema = z.object({
  name: z.string().min(3).max(256),
  urlId: z.string().max(100),
  videoLink: z.string().min(3).max(256),
  details: z.string().optional(),
})

export const getTopicSchema = z.object({
  id: z.number(),
  courseId: z.number(),
})

export const getTopicsSchema = z.object({
  limit: z.number().default(10),
  offset: z.number().default(0),
  sort: z.string().optional().nullable(),
  store_ids: z.string().optional().nullable(),
  active: z.string().optional().nullable(),
})
