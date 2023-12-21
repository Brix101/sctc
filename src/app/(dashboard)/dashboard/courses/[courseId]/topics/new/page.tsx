import { env } from "@/env.mjs"
import { currentUser } from "@clerk/nextjs"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { AddTopicForm } from "@/components/forms/add-topic-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "New Topic",
  description: "Add a new topic",
}

interface NewTopicPageProps {
  params: {
    courseId: string
  }
}

export default async function NewTopicPage({ params }: NewTopicPageProps) {
  const courseId = Number(params.courseId)

  const user = await currentUser()

  if (!user) {
    redirect("/sigin")
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Add topic</CardTitle>
        <CardDescription>Add a new topic to your course</CardDescription>
      </CardHeader>
      <CardContent>
        <AddTopicForm courseId={courseId} />
      </CardContent>
    </Card>
  )
}
