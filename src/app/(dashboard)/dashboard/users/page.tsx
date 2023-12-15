import { env } from "@/env.mjs"
import type { Metadata } from "next"
import * as React from "react"

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shells/shell"
import { UsersTableShell } from "@/components/shells/users-table-shell"
import { dashboardTopicsSearchParamsSchema } from "@/lib/validations/params"
import { clerkClient } from "@clerk/nextjs"
import { User } from "@clerk/nextjs/server"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Users",
  description: "Manage your users settings",
}

interface UsersPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const { page, per_page } =
    dashboardTopicsSearchParamsSchema.parse(searchParams)

  // Fallback page for invalid page numbers
  const pageAsNumber = Number(page)
  const fallbackPage =
    isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber
  // Number of items per page
  const perPageAsNumber = Number(per_page)
  const limit = isNaN(perPageAsNumber) ? 10 : perPageAsNumber
  // Number of items to skip
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0

  const count = await clerkClient.users.getCount()
  const items = (await clerkClient.users.getUserList({ limit, offset })).map(
    user => {
      const { emailAddresses, externalAccounts, ...userWithoutSensitiveInfo } =
        user

      return userWithoutSensitiveInfo as User
    },
  )

  const transaction = Promise.resolve({
    items,
    count,
  })

  return (
    <Shell variant="sidebar">
      <PageHeader
        id="users-header"
        aria-labelledby="users-header-heading"
        separated
      >
        <PageHeaderHeading size="sm">Users</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your users settings
        </PageHeaderDescription>
      </PageHeader>
      <section
        id="user-users-info"
        aria-labelledby="user-users-info-heading"
        className="w-full overflow-hidden"
      >
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={6}
              isNewRowCreatable={true}
              isRowsDeletable={true}
            />
          }
        >
          <UsersTableShell transaction={transaction} limit={limit} />
        </React.Suspense>
      </section>
    </Shell>
  )
}
