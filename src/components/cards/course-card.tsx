import Link from "next/link"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Course } from "@/db/schema"
import { getRandomPatternStyle } from "@/lib/generate-pattern"
import { cn } from "@/lib/utils"

interface CourseCardProps {
  course: Course
  href: string
}

export function CourseCard({ course, href }: CourseCardProps) {
  return (
    <Link href={href}>
      <span className="sr-only">{course.name}</span>
      <Card className="h-full overflow-hidden transition-colors hover:bg-muted/50">
        <AspectRatio ratio={21 / 9}>
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-zinc-950/50" />
          <Badge
            className={cn(
              "pointer-events-none absolute right-2 top-2 rounded-sm px-2 py-0.5 font-semibold",
              course.active
                ? "border-green-600/20 bg-green-100 text-green-700"
                : "border-red-600/10 bg-red-100 text-red-700",
            )}
          >
            {course.active ? "Active" : "Inactive"}
          </Badge>
          <div
            className="h-full rounded-t-md border-b"
            style={getRandomPatternStyle(String(course.id))}
          />
        </AspectRatio>
        <CardHeader className="space-y-2">
          <CardTitle className="line-clamp-1">{course.name}</CardTitle>
          <CardDescription className="line-clamp-1">
            {course.description?.length
              ? course.description
              : `Explore ${course.name} products`}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}
