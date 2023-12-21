"use client"

import { type Topic } from "@/db/schema"
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { getNextTopicId, getPreviousTopicId } from "@/lib/fetchers/topic"

interface TopicPagerProps {
  topic: Topic
}

export function TopicPager({ topic }: TopicPagerProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  return (
    <div className="flex space-x-0.5">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          startTransition(async () => {
            try {
              const prevTopicId = await getPreviousTopicId({
                id: topic.id,
                courseId: topic.courseId,
              })
              router.push(
                `/dashboard/courses/${topic.courseId}/topics/${prevTopicId}`,
              )
            } catch (error) {
              error instanceof Error
                ? toast.error(error.message)
                : toast.error("Something went wrong, please try again.")
            }
          })
        }}
        disabled={isPending}
      >
        <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Previous topic</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          startTransition(async () => {
            try {
              const nextTopicId = await getNextTopicId({
                id: topic.id,
                courseId: topic.courseId,
              })
              router.push(
                `/dashboard/courses/${topic.courseId}/topics/${nextTopicId}`,
              )
            } catch (error) {
              error instanceof Error
                ? toast.error(error.message)
                : toast.error("Something went wrong, please try again.")
            }
          })
        }}
        disabled={isPending}
      >
        <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Next topic</span>
      </Button>
    </div>
  )
}
