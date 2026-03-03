import ChapterClient from "@/components/student/ChapterClient"
import chaptersData from "@/data/chapters.json"

export function generateStaticParams() {
  const paths = []
  Object.entries(chaptersData).forEach(([subjectId, chapters]) => {
    chapters.forEach((chapter) => {
      paths.push({ subjectId, chapterId: chapter.id })
    })
  })
  return paths
}

export default async function ChapterPage({ params }) {
  const { subjectId, chapterId } = await params
  return <ChapterClient subjectId={subjectId} chapterId={chapterId} />
}