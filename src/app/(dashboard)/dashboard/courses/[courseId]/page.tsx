import { db } from "@/db"
import { courses } from "@/db/schema"
import { env } from "@/env.mjs"
import { eq } from "drizzle-orm"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import { LoadingButton } from "@/components/loading-button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { deleteCourse, updateCourse } from "@/lib/actions/course"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Manage course",
  description: "Manage your course",
}

interface UpdatecoursePageProps {
  params: {
    courseId: string
  }
}

export default async function UpdatecoursePage({
  params,
}: UpdatecoursePageProps) {
  const courseId = Number(params.courseId)

  const course = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    columns: {
      id: true,
      name: true,
      description: true,
    },
  })

  if (!course) {
    notFound()
  }

  return (
    <div className="space-y-10">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Update your course</CardTitle>
          <CardDescription>
            Update your course name and description, or delete it
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={updateCourse.bind(null, courseId)}
            className="grid w-full max-w-xl gap-5"
          >
            <div className="grid gap-2.5">
              <Label htmlFor="update-course-name">Name</Label>
              <Input
                id="update-course-name"
                aria-describedby="update-course-name-description"
                name="name"
                required
                minLength={3}
                maxLength={50}
                placeholder="Type course name here."
                defaultValue={course.name ?? ""}
              />
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="update-course-description">Description</Label>
              <Textarea
                id="update-course-description"
                aria-describedby="update-course-description-description"
                name="description"
                minLength={3}
                maxLength={255}
                placeholder="Type course description here."
                defaultValue={course.description ?? ""}
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <LoadingButton>
                Update course
                <span className="sr-only">Update course</span>
              </LoadingButton>
              <LoadingButton
                formAction={deleteCourse.bind(null, courseId)}
                variant="destructive"
              >
                Delete course
                <span className="sr-only">Delete course</span>
              </LoadingButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
