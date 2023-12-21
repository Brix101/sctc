"use server"

import { db } from "@/db"
import { topics } from "@/db/schema"
import { and, eq, not } from "drizzle-orm"
import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { z } from "zod"

import { getTopicSchema, topicSchema } from "@/lib/validations/topic"

const extendedTopicSchema = topicSchema.extend({
  courseId: z.number(),
})

export async function checkTopic(input: { name: string; id?: number }) {
  noStore()
  try {
    const topicWithSameName = await db.query.topics.findFirst({
      columns: {
        id: true,
      },
      where: input.id
        ? and(not(eq(topics.id, input.id)), eq(topics.name, input.name))
        : eq(topics.name, input.name),
    })

    if (topicWithSameName) {
      throw new Error("Topic name already taken.")
    }
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function addTopic(input: z.infer<typeof extendedTopicSchema>) {
  const topicWithSameName = await db.query.topics.findFirst({
    columns: {
      id: true,
    },
    where: eq(topics.name, input.name),
  })

  if (topicWithSameName) {
    throw new Error("Topic name already taken.")
  }

  await db.insert(topics).values({
    ...input,
    courseId: input.courseId,
  })

  revalidatePath(`/dashboard/courses/${input.courseId}/topics.`)
}

const extendedTopicSchemaWithId = extendedTopicSchema.extend({
  id: z.number(),
})

export async function updateTopic(
  input: z.infer<typeof extendedTopicSchemaWithId>,
) {
  const topic = await db.query.topics.findFirst({
    where: and(eq(topics.id, input.id), eq(topics.courseId, input.courseId)),
  })

  if (!topic) {
    throw new Error("Topic not found.")
  }

  await db.update(topics).set(input).where(eq(topics.id, input.id))

  revalidatePath(`/dashboard/courses/${input.courseId}/topics/${input.id}`)
}

export async function deleteTopic(rawInput: z.infer<typeof getTopicSchema>) {
  const input = getTopicSchema.parse(rawInput)

  const topic = await db.query.topics.findFirst({
    columns: {
      id: true,
    },
    where: and(eq(topics.id, input.id), eq(topics.courseId, input.courseId)),
  })

  if (!topic) {
    throw new Error("Topic not found.")
  }

  await db.delete(topics).where(eq(topics.id, input.id))

  revalidatePath(`/dashboard/courses/${input.courseId}/topics`)
}
