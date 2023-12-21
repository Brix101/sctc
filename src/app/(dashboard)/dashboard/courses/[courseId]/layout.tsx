import { db } from "@/db"
import { courses } from "@/db/schema"
import { currentUser } from "@clerk/nextjs"
import { notFound, redirect } from "next/navigation"

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { CourseSwitcher } from "@/components/pagers/course-switcher"
import { CourseTabs } from "@/components/pagers/course-tabs"
import { Shell } from "@/components/shells/shell"

interface CourseLayoutProps extends React.PropsWithChildren {
  params: {
    courseId: string
  }
}

export default async function CourseLayout({
  children,
  params,
}: CourseLayoutProps) {
  const courseId = Number(params.courseId)

  const user = await currentUser()

  if (!user) {
    redirect("/signin")
  }

  const allcourses = await db
    .select({
      id: courses.id,
      name: courses.name,
    })
    .from(courses)

  const course = allcourses.find(course => course.id === courseId)

  if (!course) {
    notFound()
  }

  return (
    <Shell variant="sidebar">
      <div className="xxs:flex-row flex flex-col gap-4 pr-1">
        <PageHeader className="flex-1">
          <PageHeaderHeading size="sm">Dashboard</PageHeaderHeading>
          <PageHeaderDescription size="sm">
            Manage your course
          </PageHeaderDescription>
        </PageHeader>
        {allcourses.length > 1 ? (
          <CourseSwitcher
            currentCourse={course}
            courses={allcourses}
            dashboardRedirectPath={"/dashboard/courses"}
          />
        ) : null}
      </div>
      <div className="space-y-8 overflow-auto">
        <CourseTabs courseId={courseId} />
        {children}
      </div>
    </Shell>
  )
}
