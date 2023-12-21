import { env } from "@/env.mjs"
import { currentUser } from "@clerk/nextjs"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { AddCourseForm } from "@/components/forms/add-course-form"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shells/shell"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "New Course",
  description: "Add a new course",
}

export default async function NewCoursePage() {
  const user = await currentUser()

  if (!user) {
    redirect("/signin")
  }

  return (
    <Shell variant="sidebar">
      <PageHeader
        id="new-course-page-header"
        aria-labelledby="new-course-page-header-heading"
      >
        <PageHeaderHeading size="sm">New Course</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Add a new course to your account
        </PageHeaderDescription>
      </PageHeader>
      <Card
        id="new-course-page-form-container"
        aria-labelledby="new-course-page-form-heading"
      >
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Add course</CardTitle>
          <CardDescription>Add a new course to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <AddCourseForm />
        </CardContent>
      </Card>
    </Shell>
  )
}
