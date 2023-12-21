"use client"

import Image from "next/image"
import Link from "next/link"
import * as React from "react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Course } from "@/types"

interface CourseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  topic: Course
  variant?: "default" | "switchable"
  isAddedToCart?: boolean
  onSwitch?: () => Promise<void>
}

export function TopicCard({
  topic,
  variant = "default",
  isAddedToCart = false,
  onSwitch,
  className,
  ...props
}: CourseCardProps) {
  return (
    <Card
      className={cn("h-full w-full overflow-hidden rounded-sm", className)}
      {...props}
    >
      <Link aria-label={topic.title} href={`/courses/${topic.id}`}>
        <CardHeader className="border-b p-0">
          <AspectRatio ratio={4 / 3}>
            <Image
              src={`https://img.youtube.com/vi/${topic.id}/hqdefault.jpg`}
              alt={topic.title}
              className="object-cover"
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              fill
              loading="lazy"
            />
          </AspectRatio>
        </CardHeader>
        <span className="sr-only">{topic.title}</span>
      </Link>
      <Link href={`/courses/${topic.id}`} tabIndex={-1}>
        <CardContent className="space-y-1.5 p-4">
          <CardTitle className="line-clamp-1">{topic.title}</CardTitle>
        </CardContent>
      </Link>
    </Card>
  )
}
