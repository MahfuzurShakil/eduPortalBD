import { create } from "zustand"

const useQuizStore = create((set, get) => ({
  // Config set before quiz starts
  config: null,        // { subjectId, subjectName, chapters, questionCount, timePerQuestion }
  questions: [],       // shuffled question list for current quiz
  
  // Active quiz state
  currentIndex: 0,
  answers: {},         // { questionId: selectedOptionIndex }
  timeLeft: 0,
  isFinished: false,
  startedAt: null,

  // Result stored after submission
  result: null,

  setConfig: (config) => set({ config }),
  setQuestions: (questions) => set({ questions, currentIndex: 0, answers: {}, isFinished: false, startedAt: Date.now() }),
  setAnswer: (questionId, optionIndex) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: optionIndex } })),
  setCurrentIndex: (index) => set({ currentIndex: index }),
  setTimeLeft: (timeLeft) => set({ timeLeft }),
  finishQuiz: () => set({ isFinished: true }),
  setResult: (result) => set({ result }),
  resetQuiz: () => set({
    config: null, questions: [], currentIndex: 0,
    answers: {}, timeLeft: 0, isFinished: false, startedAt: null, result: null,
  }),
}))

export default useQuizStore