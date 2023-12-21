"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { type z } from "zod"

import { Icons } from "@/components/icons"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { addTopic, checkTopic } from "@/lib/actions/topic"
import { catchError } from "@/lib/utils"
import { topicSchema } from "@/lib/validations/topic"
import Link from "next/link"

interface AddTopicFormProps {
  courseId: number
}

type Inputs = z.infer<typeof topicSchema>

export function AddTopicForm({ courseId }: AddTopicFormProps) {
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<Inputs>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      name: "",
      urlId: "",
      videoLink: "",
      details: "",
    },
  })

  function onSubmit(data: Inputs) {
    startTransition(async () => {
      try {
        await checkTopic({
          name: data.name,
        })

        await addTopic({
          ...data,
          courseId,
        })

        toast.success("Topic added successfully.")

        form.reset()
      } catch (err) {
        catchError(err)
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full max-w-2xl gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Type topic name here." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="urlId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>urlId</FormLabel>
              <FormControl>
                <Input
                  placeholder="Type topic urlId here."
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="videoLink"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Video link</FormLabel>
              <FormControl>
                <Input
                  placeholder="Type topic video link here."
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Details</FormLabel>
              <FormControl>
                <Textarea placeholder="Type topic details here." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={() => void form.trigger(["name", "urlId", "videoLink"])}
            className="w-fit"
            disabled={isPending}
          >
            {isPending && (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Add Topic
            <span className="sr-only">Add Topic</span>
          </Button>
          <Link
            aria-label="Cancel"
            href={`/dashboard/courses/${courseId}/topics`}
            className={buttonVariants({
              variant: "destructive",
            })}
          >
            Cancel
            <span className="sr-only">Cancel</span>
          </Link>
        </div>
      </form>
    </Form>
  )
}
