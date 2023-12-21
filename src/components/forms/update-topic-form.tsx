"use client"

import { type Topic } from "@/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import * as React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { type z } from "zod"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { checkTopic, deleteTopic, updateTopic } from "@/lib/actions/topic"
import { catchError } from "@/lib/utils"
import { topicSchema } from "@/lib/validations/topic"
import { FileWithPreview } from "@/types"
import Image from "next/image"
import { Zoom } from "../zoom-image"

interface UpdateTopicFormProps {
  topic: Topic
}

type Inputs = z.infer<typeof topicSchema>

export function UpdateTopicForm({ topic }: UpdateTopicFormProps) {
  const router = useRouter()
  const [thumbnailPreview, setThumbnailPreview] =
    React.useState<FileWithPreview | null>(null)
  const [isPending, startTransition] = React.useTransition()

  React.useEffect(() => {
    if (topic.urlId) {
      const file = new File([], topic.name ?? "file name", {
        type: "image",
      })
      const fileWithPreview = Object.assign(file, {
        preview: `https://img.youtube.com/vi/${topic.urlId}/maxresdefault.jpg`,
      })
      setThumbnailPreview(fileWithPreview)
    }
  }, [topic])

  const form = useForm<Inputs>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      name: topic.name ?? "",
      details: topic.details ?? "",
      urlId: topic.urlId ?? "",
      videoLink: topic.videoLink ?? "",
    },
  })

  function onSubmit(data: Inputs) {
    startTransition(async () => {
      try {
        await checkTopic({
          name: data.name,
          id: topic.id,
        })

        await updateTopic({
          ...data,
          id: topic.id,
          courseId: topic.courseId,
        })

        toast.success("Topic updated successfully.")
      } catch (err) {
        catchError(err)
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full max-w-2xl gap-5"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input
              aria-invalid={!!form.formState.errors.name}
              placeholder="Type topic name here."
              {...form.register("name")}
              defaultValue={topic.name ?? ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem className="w-full">
          <FormLabel>URL ID</FormLabel>
          <FormControl>
            <Input
              placeholder="Type topic URL ID here."
              {...form.register("urlId")}
              defaultValue={topic.urlId ?? ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem className="w-full">
          <FormLabel>Video Link</FormLabel>
          <FormControl>
            <Input
              placeholder="Type topic video link here."
              {...form.register("videoLink")}
              defaultValue={topic.videoLink ?? ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Details</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Type topic details here."
              {...form.register("details")}
              defaultValue={topic.details ?? ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <div className="flex items-center gap-2">
          {thumbnailPreview ? (
            <Zoom>
              <Image
                src={thumbnailPreview.preview}
                alt={thumbnailPreview.name}
                className="h-20 w-20 shrink-0 rounded-md object-cover object-center"
                width={640}
                height={480}
              />
            </Zoom>
          ) : undefined}
        </div>

        <div className="flex space-x-2">
          <Button disabled={isPending}>
            {isPending && (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Update Topic
            <span className="sr-only">Update topic</span>
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              startTransition(async () => {
                void form.trigger(["name", "urlId", "videoLink"])
                await deleteTopic({
                  courseId: topic.courseId,
                  id: topic.id,
                })
                router.push(`/dashboard/courses/${topic.courseId}/topics`)
              })
            }}
            disabled={isPending}
          >
            {isPending && (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Delete Topic
            <span className="sr-only">Delete topic</span>
          </Button>
        </div>
      </form>
    </Form>
  )
}
