import { create } from "zustand"

const useQuizStore = create((set, get) => ({
  config: null,
  questions: [],
  currentIndex: 0,
  answers: {},
  timeLeft: 0,
  isFinished: false,
  startedAt: null,
  result: null,

  setConfig: (config) => set({ config }),
  setQuestions: (questions) => set({ questions, currentIndex: 0, answers: {}, isFinished: false, startedAt: Date.now() }),
  setAnswer: (questionId, optionIndex) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: optionIndex } })),
  setCurrentIndex: (index) => set({ currentIndex: index }),
  setTimeLeft: (timeLeft) => set({ timeLeft }),
  decrementTime: () => set((state) => ({ timeLeft: Math.max(0, state.timeLeft - 1) })),
  finishQuiz: () => set({ isFinished: true }),
  setResult: (result) => set({ result }),
  resetQuiz: () => set({
    config: null, questions: [], currentIndex: 0,
    answers: {}, timeLeft: 0, isFinished: false, startedAt: null, result: null,
  }),
}))

export default useQuizStore