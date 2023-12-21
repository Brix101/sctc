import { ErrorCard } from "@/components/cards/error-card"
import { Shell } from "@/components/shells/shell"

export default function CourseNotFound() {
  return (
    <Shell variant="centered" className="max-w-md">
      <ErrorCard
        title="Course not found"
        description="The course may have deleted or you may have already updated your course"
        retryLink="/dashboard/courses"
        retryLinkText="Go to Courses"
      />
    </Shell>
  )
}
