"use server"

import { unstable_noStore as noStore } from "next/cache"
import { z } from "zod"

import { db } from "@/db"
import { topics } from "@/db/schema"
import { getTopicSchema } from "@/lib/validations/topic"
import { and, asc, desc, eq, gt, lt } from "drizzle-orm"

// export async function getTopics(rawInput: z.infer<typeof getTopicsSchema>) {
//   noStore()
//   try {
//     const input = getTopicsSchema.parse(rawInput)

//     const [column, order] = (input.sort?.split(".") as [
//       keyof Topic | undefined,
//       "asc" | "desc" | undefined,
//     ]) ?? ["createdAt", "desc"]
//     const [minPrice, maxPrice] = input.price_range?.split("-") ?? []
//     const categories =
//       (input.categories?.split(".") as Topic["category"][]) ?? []
//     const subcategories = input.subcategories?.split(".") ?? []
//     const courseIds = input.course_ids?.split(".").map(Number) ?? []

//     const { items, count } = await dbPool.transaction(async tx => {
//       const items = await tx
//         .select({
//           id: topics.id,
//           name: topics.name,
//           description: topics.description,
//           images: topics.images,
//           category: topics.category,
//           subcategory: topics.subcategory,
//           price: topics.price,
//           inventory: topics.inventory,
//           rating: topics.rating,
//           tags: topics.tags,
//           courseId: topics.courseId,
//           createdAt: topics.createdAt,
//           updatedAt: topics.updatedAt,
//         })
//         .from(topics)
//         .limit(input.limit)
//         .offset(input.offset)
//         .leftJoin(courses, eq(topics.courseId, courses.id))
//         .where(
//           and(
//             categories.length
//               ? inArray(topics.category, categories)
//               : undefined,
//             subcategories.length
//               ? inArray(topics.subcategory, subcategories)
//               : undefined,
//             minPrice ? gte(topics.price, minPrice) : undefined,
//             maxPrice ? lte(topics.price, maxPrice) : undefined,
//             courseIds.length ? inArray(topics.courseId, courseIds) : undefined,
//             input.active === "true"
//               ? sql`(${courses.stripeAccountId}) is not null`
//               : undefined,
//           ),
//         )
//         .groupBy(topics.id)
//         .orderBy(
//           column && column in topics
//             ? order === "asc"
//               ? asc(topics[column])
//               : desc(topics[column])
//             : desc(topics.createdAt),
//         )

//       const count = await tx
//         .select({
//           count: sql<number>`count(*)`,
//         })
//         .from(topics)
//         .where(
//           and(
//             categories.length
//               ? inArray(topics.category, categories)
//               : undefined,
//             subcategories.length
//               ? inArray(topics.subcategory, subcategories)
//               : undefined,
//             minPrice ? gte(topics.price, minPrice) : undefined,
//             maxPrice ? lte(topics.price, maxPrice) : undefined,
//             courseIds.length ? inArray(topics.courseId, courseIds) : undefined,
//           ),
//         )
//         .execute()
//         .then(res => res[0]?.count ?? 0)

//       return {
//         items,
//         count,
//       }
//     })

//     return {
//       items,
//       count,
//     }
//   } catch (err) {
//     console.error(err)
//     throw err instanceof Error
//       ? err.message
//       : err instanceof z.ZodError
//         ? err.issues.map(issue => issue.message).join("\n")
//         : new Error("Unknown error.")
//   }
// }

export async function getNextTopicId(rawInput: z.infer<typeof getTopicSchema>) {
  noStore()
  try {
    const input = getTopicSchema.parse(rawInput)

    const topic = await db.query.topics.findFirst({
      columns: {
        id: true,
      },
      where: and(eq(topics.courseId, input.courseId), gt(topics.id, input.id)),
      orderBy: asc(topics.id),
    })

    if (!topic) {
      throw new Error("Topic not found.")
    }

    return topic.id
  } catch (err) {
    console.error(err)
    throw err instanceof Error
      ? err.message
      : err instanceof z.ZodError
        ? err.issues.map(issue => issue.message).join("\n")
        : new Error("Unknown error.")
  }
}

export async function getPreviousTopicId(
  rawInput: z.infer<typeof getTopicSchema>,
) {
  try {
    const input = getTopicSchema.parse(rawInput)

    const topic = await db.query.topics.findFirst({
      columns: {
        id: true,
      },
      where: and(eq(topics.courseId, input.courseId), lt(topics.id, input.id)),
      orderBy: desc(topics.id),
    })

    if (!topic) {
      throw new Error("Topic not found.")
    }

    return topic.id
  } catch (err) {
    console.error(err)
    throw err instanceof Error
      ? err.message
      : err instanceof z.ZodError
        ? err.issues.map(issue => issue.message).join("\n")
        : new Error("Unknown error.")
  }
}
