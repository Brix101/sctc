import { db, dbPool } from "@/db"
import { courses, topics, type Topic } from "@/db/schema"
import { env } from "@/env.mjs"
import { and, asc, desc, eq, like, sql } from "drizzle-orm"
import { type Metadata } from "next"
import { unstable_noStore as noStore } from "next/cache"
import { notFound } from "next/navigation"
import * as React from "react"

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { TopicsTableShell } from "@/components/shells/topics-table-shell"
import { dashboardTopicsSearchParamsSchema } from "@/lib/validations/params"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Topics",
  description: "Manage your topics",
}

interface TopicsPageProps {
  params: {
    courseId: string
  }
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function TopicsPage({
  params,
  searchParams,
}: TopicsPageProps) {
  const courseId = Number(params.courseId)

  // Parse search params using zod schema
  const { page, per_page, sort, name } =
    dashboardTopicsSearchParamsSchema.parse(searchParams)

  const course = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    columns: {
      id: true,
      name: true,
    },
  })

  if (!course) {
    notFound()
  }

  // Fallback page for invalid page numbers
  const pageAsNumber = Number(page)
  const fallbackPage =
    isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber
  // Number of items per page
  const perPageAsNumber = Number(per_page)
  const limit = isNaN(perPageAsNumber) ? 10 : perPageAsNumber
  // Number of items to skip
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0
  // Column and order to sort by
  const [column, order] = (sort?.split(".") as [
    keyof Topic | undefined,
    "asc" | "desc" | undefined,
  ]) ?? ["createdAt", "desc"]

  // Transaction is used to ensure both queries are executed in a single transaction
  noStore()

  const transaction = dbPool.transaction(async tx => {
    const items = await tx
      .select({
        id: topics.id,
        name: topics.name,
        urlId: topics.urlId,
        videoLink: topics.videoLink,
        createdAt: topics.createdAt,
      })
      .from(topics)
      .limit(limit)
      .offset(offset)
      .where(
        and(
          eq(topics.courseId, courseId),
          // Filter by name
          name ? like(topics.name, `%${name}%`) : undefined,
        ),
      )
      .orderBy(
        column && column in topics
          ? order === "asc"
            ? asc(topics[column])
            : desc(topics[column])
          : desc(topics.createdAt),
      )

    const count = await tx
      .select({
        count: sql<number>`count(${topics.id})`,
      })
      .from(topics)
      .where(
        and(
          eq(topics.courseId, courseId),
          // Filter by name
          name ? like(topics.name, `%${name}%`) : undefined,
        ),
      )
      .then(res => res[0]?.count ?? 0)

    return {
      items,
      count,
    }
  })

  return (
    <div className="space-y-6">
      <React.Suspense
        fallback={
          <DataTableSkeleton
            columnCount={6}
            isNewRowCreatable={true}
            isRowsDeletable={true}
          />
        }
      >
        <TopicsTableShell
          transaction={transaction}
          limit={limit}
          courseId={courseId}
        />
      </React.Suspense>
    </div>
  )
}
