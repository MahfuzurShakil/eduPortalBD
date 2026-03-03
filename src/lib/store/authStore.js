import { create } from "zustand"
import { persist } from "zustand/middleware"
import { persistUserProfile } from "@/lib/mock/auth"

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

      updateProfile: (profile) => {
        const { user } = get()
        // Persist to localStorage so login reload restores it
        if (user?.phone) {
          persistUserProfile(user.phone, profile)
        }
        set((state) => ({
          user: { ...state.user, profile, isOnboarded: true },
        }))
      },

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