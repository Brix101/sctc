"use client"

import { type Topic } from "@/db/schema"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import * as React from "react"
import { toast } from "sonner"

import { DataTable } from "@/components/data-table/data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteTopic } from "@/lib/actions/topic"
import { catchError, formatDate } from "@/lib/utils"

type AwaitedTopic = Pick<
  Topic,
  "id" | "name" | "urlId" | "videoLink" | "createdAt"
>

interface TopicsTableShellProps {
  transaction: Promise<{
    items: AwaitedTopic[]
    count: number
  }>
  limit: number
  courseId: number
}

export function TopicsTableShell({
  transaction,
  limit,
  courseId,
}: TopicsTableShellProps) {
  const { items: data, count } = React.use(transaction)
  const pageCount = Math.ceil(count / limit)

  const [isPending, startTransition] = React.useTransition()
  const [selectedRowIds, setSelectedRowIds] = React.useState<number[]>([])

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<AwaitedTopic, unknown>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={value => {
              table.toggleAllPageRowsSelected(!!value)
              setSelectedRowIds(prev =>
                prev.length === data.length ? [] : data.map(row => row.id),
              )
            }}
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={value => {
              row.toggleSelected(!!value)
              setSelectedRowIds(prev =>
                value
                  ? [...prev, row.original.id]
                  : prev.filter(id => id !== row.original.id),
              )
            }}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
      },
      {
        accessorKey: "urlId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Url Id" />
        ),
      },
      {
        accessorKey: "videoLink",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Video Link" />
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ cell }) => formatDate(cell.getValue() as Date),
        enableColumnFilter: false,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <DotsHorizontalIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/courses/${courseId}/topics/${row.original.id}`}
                >
                  Edit
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem asChild>
                <Link href={`/topic/${row.original.id}`}>View</Link>
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  startTransition(() => {
                    row.toggleSelected(false)

                    toast.promise(
                      deleteTopic({
                        id: row.original.id,
                        courseId,
                      }),
                      {
                        loading: "Deleting...",
                        success: () => "Topic deleted successfully.",
                        error: (err: unknown) => catchError(err),
                      },
                    )
                  })
                }}
                disabled={isPending}
              >
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [data, isPending, courseId],
  )

  function deleteSelectedRows() {
    toast.promise(
      Promise.all(
        selectedRowIds.map(id =>
          deleteTopic({
            id,
            courseId,
          }),
        ),
      ),
      {
        loading: "Deleting...",
        success: () => {
          setSelectedRowIds([])
          return "Topics deleted successfully."
        },
        error: (err: unknown) => {
          setSelectedRowIds([])
          return catchError(err)
        },
      },
    )
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      filterableColumns={[]}
      searchableColumns={[
        {
          id: "name",
          title: "names",
        },
      ]}
      newRowLink={`/dashboard/courses/${courseId}/topics/new`}
      deleteRowsAction={() => void deleteSelectedRows()}
    />
  )
}
