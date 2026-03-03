import questionsData from "@/data/questions.json"

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Pick N random questions from given subject + chapters
 * Shuffles options and tracks correct answer index after shuffle
 */
export function pickQuestions({ subjectId, chapterIds, count }) {
  const allSubjectQs = questionsData[subjectId] || []
  
  // Filter by selected chapters (if empty, use all)
  let pool = chapterIds && chapterIds.length > 0
    ? allSubjectQs.filter(q => chapterIds.includes(q.chapterId))
    : allSubjectQs

  // Shuffle pool and pick N
  const picked = shuffle(pool).slice(0, count)

  // For each question, shuffle its options and update correct index
  return picked.map(q => {
    const indexed = q.options.map((opt, i) => ({ opt, isCorrect: i === q.correct }))
    const shuffled = shuffle(indexed)
    return {
      ...q,
      options: shuffled.map(x => x.opt),
      correct: shuffled.findIndex(x => x.isCorrect),
    }
  })
}

export function getAvailableCount({ subjectId, chapterIds }) {
  const allSubjectQs = questionsData[subjectId] || []
  if (!chapterIds || chapterIds.length === 0) return allSubjectQs.length
  return allSubjectQs.filter(q => chapterIds.includes(q.chapterId)).length
}