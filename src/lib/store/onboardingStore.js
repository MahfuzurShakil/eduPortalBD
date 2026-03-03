import { create } from "zustand"

const useOnboardingStore = create((set, get) => ({
  // Current step index
  currentStep: 0,

  // All selections
  selections: {
    educationType: null,   // general | madrasa | technical
    medium: null,          // bangla | english | english_version
    stream: null,          // aliya | qawmi (madrasa only)
    level: null,           // primary | secondary | ebtedayi | dakhil | qawmi levels
    className: null,       // Class 1 … Class 10
    group: null,           // science | commerce | arts
  },

  // Step history stack (for back button)
  stepHistory: [0],

  setSelection: (key, value) =>
    set((state) => ({
      selections: { ...state.selections, [key]: value },
    })),

  goToStep: (step) =>
    set((state) => ({
      currentStep: step,
      stepHistory: [...state.stepHistory, step],
    })),

  goBack: () =>
    set((state) => {
      const history = [...state.stepHistory]
      history.pop()
      const prevStep = history[history.length - 1] ?? 0
      return { currentStep: prevStep, stepHistory: history }
    }),

  resetOnboarding: () =>
    set({
      currentStep: 0,
      selections: {
        educationType: null, medium: null, stream: null,
        level: null, className: null, group: null,
      },
      stepHistory: [0],
    }),
}))

export default useOnboardingStore