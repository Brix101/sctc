import { db } from "@/db"
import { topics } from "@/db/schema"
import { env } from "@/env.mjs"
import { and, eq } from "drizzle-orm"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import { UpdateTopicForm } from "@/components/forms/update-topic-form"
import { TopicPager } from "@/components/pagers/topic-pager"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Manage Topic",
  description: "Manage your topic",
}

interface UpdateTopicPageProps {
  params: {
    courseId: string
    topicId: string
  }
}

export default async function UpdateTopicPage({
  params,
}: UpdateTopicPageProps) {
  const courseId = Number(params.courseId)
  const topicId = Number(params.topicId)

  const topic = await db.query.topics.findFirst({
    where: and(eq(topics.id, topicId), eq(topics.courseId, courseId)),
  })

  if (!topic) {
    notFound()
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between space-x-2">
          <CardTitle className="text-2xl">Update topic</CardTitle>
          <TopicPager topic={topic} />
        </div>
        <CardDescription>
          Update your topic information, or delete it
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UpdateTopicForm topic={topic} />
      </CardContent>
    </Card>
  )
}
