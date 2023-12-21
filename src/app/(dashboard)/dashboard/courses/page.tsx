import { env } from "@/env.mjs"
import type { Metadata } from "next"
import * as React from "react"

import { CourseCard } from "@/components/cards/course-card"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shells/shell"
import { CourseCardSkeleton } from "@/components/skeletons/course-card-skeleton"
import { buttonVariants } from "@/components/ui/button"
import { db } from "@/db"
import { cn } from "@/lib/utils"
import Link from "next/link"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Courses",
  description: "Manage your courses settings",
}

export default async function CoursesPage() {
  const allCourses = await db.query.courses.findMany()

  return (
    <Shell variant="sidebar">
      <PageHeader
        id="courses-header"
        aria-labelledby="courses-header-heading"
        separated
      >
        <div className="flex space-x-4">
          <PageHeaderHeading size="sm" className="flex-1">
            Courses
          </PageHeaderHeading>
          <Link
            aria-label="Create course"
            href="/dashboard/courses/new"
            className={cn(
              buttonVariants({
                size: "sm",
              }),
            )}
          >
            Create course
          </Link>
        </div>
        <PageHeaderDescription size="sm">
          Manage your courses
        </PageHeaderDescription>
      </PageHeader>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <React.Suspense
          fallback={Array.from({ length: 3 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        >
          {allCourses.map(store => (
            <CourseCard
              key={store.id}
              course={store}
              href={`/dashboard/courses/${store.id}`}
            />
          ))}
        </React.Suspense>
      </section>
    </Shell>
  )
}
