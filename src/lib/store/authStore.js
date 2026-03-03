import { create } from "zustand"
import { persist } from "zustand/middleware"

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      pendingRegistration: null,

      setUser: (user) => set({ user, isAuthenticated: true }),

      logout: () => set({ user: null, isAuthenticated: false }),

      setPendingRegistration: (data) => set({ pendingRegistration: data }),

      clearPendingRegistration: () => set({ pendingRegistration: null }),

      updateProfile: (profile) =>
        set((state) => ({
          user: { ...state.user, profile, isOnboarded: true },
        })),

      updateQuizHistory: (entry) =>
        set((state) => ({
          user: {
            ...state.user,
            quizHistory: [...(state.user?.quizHistory || []), entry],
          },
        })),
    }),
    {
      name: "eduportal-auth",
    }
  )
)

export default useAuthStore