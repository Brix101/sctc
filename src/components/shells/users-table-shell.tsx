"use client"

import { type ColumnDef } from "@tanstack/react-table"
import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { OmitedUser } from "@/types"

type AwaitedUser = Pick<OmitedUser, "id" | "firstName" | "lastName" | "email">

interface UsersTableShellProps {
  transaction: Promise<{
    items: AwaitedUser[]
    count: number
  }>
  limit: number
}

export function UsersTableShell({ transaction, limit }: UsersTableShellProps) {
  const { items: data, count } = React.use(transaction)
  const pageCount = Math.ceil(count / limit)

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<AwaitedUser, unknown>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="First Name" />
        ),
      },
      {
        accessorKey: "lastName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Last Name" />
        ),
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      filterableColumns={[]}
      searchableColumns={[
        {
          id: "firstName",
          title: "names",
        },
      ]}
    />
  )
}
