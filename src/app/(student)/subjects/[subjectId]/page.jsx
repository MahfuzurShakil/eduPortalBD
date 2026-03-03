import SubjectClient from "@/components/student/SubjectClient"
import chaptersData from "@/data/chapters.json"

export function generateStaticParams() {
  return Object.keys(chaptersData).map((subjectId) => ({ subjectId }))
}

export default async function SubjectPage({ params }) {
  const { subjectId } = await params
  return <SubjectClient subjectId={subjectId} />
}