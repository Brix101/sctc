import getCourses from "@/app/_action/getCourses"
import { TopicCard } from "@/components/cards/topic-card"

export default async function CoursesPage() {
  const courses = await getCourses()

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map(course => {
        return <TopicCard key={course.id} topic={course} />
      })}
    </div>
  )
}
