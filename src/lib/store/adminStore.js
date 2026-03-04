import { create } from "zustand"
import { persist } from "zustand/middleware"
import questionsRaw from "@/data/questions.json"
import videosData from "@/data/videos.json"
import usersData from "@/data/users.json"

// Your existing questions.json format: { "physics": [...], "chemistry": [...] }
// Each item has: id, chapterId, question, options, correct
// We flatten it into one array and normalize field names
const flattenQuestions = (raw) => {
  return Object.entries(raw).flatMap(([subject, questions]) =>
    questions.map((q) => ({
      ...q,
      subject,
      correctAnswer: q.correct ?? q.correctAnswer ?? 0,
      chapter: q.chapterId ?? q.chapter ?? "",
      difficulty: q.difficulty ?? "medium",
      createdAt: q.createdAt ?? new Date().toISOString(),
    }))
  )
}

const useAdminStore = create(
  persist(
    (set, get) => ({
      // Admin auth
      isAdminAuthenticated: false,
      adminUser: null,

      adminLogin: (phone, pin) => {
        const admin = usersData.find(
          (u) => u.phone === phone && u.pin === pin && u.role === "admin"
        )
        if (admin) {
          set({ isAdminAuthenticated: true, adminUser: admin })
          return { success: true }
        }
        return { success: false, error: "Invalid credentials" }
      },

      adminLogout: () => set({ isAdminAuthenticated: false, adminUser: null }),

      // Questions — flattened from subject-keyed JSON, mutations persist in localStorage
      questions: flattenQuestions(questionsRaw),

      addQuestion: (question) =>
        set((state) => ({
          questions: [
            ...state.questions,
            {
              ...question,
              id: `q_custom_${Date.now()}`,
              correctAnswer: question.correctAnswer ?? 0,
              chapter: `${question.subject}-${question.chapter}`,
              chapterId: `${question.subject}-${question.chapter}`,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      deleteQuestion: (id) =>
        set((state) => ({
          questions: state.questions.filter((q) => q.id !== id),
        })),

      updateQuestion: (id, updated) =>
        set((state) => ({
          questions: state.questions.map((q) =>
            q.id === id ? { ...q, ...updated } : q
          ),
        })),

      resetQuestions: () =>
        set({ questions: flattenQuestions(questionsRaw) }),

      // Videos
      videos: videosData,

      addVideo: (chapterId, video) =>
        set((state) => ({
          videos: {
            ...state.videos,
            [chapterId]: {
              ...video,
              updatedAt: new Date().toISOString(),
            },
          },
        })),

      deleteVideo: (chapterId) =>
        set((state) => {
          const updated = { ...state.videos }
          delete updated[chapterId]
          return { videos: updated }
        }),

      // Students — only student-role users from users.json
      students: usersData.filter((u) => u.role === "student"),

      updateStudent: (id, updates) =>
        set((state) => ({
          students: state.students.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      deleteStudent: (id) =>
        set((state) => ({
          students: state.students.filter((s) => s.id !== id),
        })),

      // Stats helper
      getStats: () => {
        const state = get()
        return {
          totalStudents: state.students.length,
          totalQuestions: state.questions.length,
          totalVideos: Object.keys(state.videos).length,
          totalQuizzesTaken: state.students.reduce(
            (acc, s) => acc + (s.quizHistory?.length || 0),
            0
          ),
        }
      },
    }),
    {
      name: "eduportal-admin",
      onRehydrateStorage: () => (state) => {
        if (state && (!state.questions || state.questions.length === 0)) {
          state.questions = flattenQuestions(questionsRaw)
        }
      },
    }
  )
)

export default useAdminStore