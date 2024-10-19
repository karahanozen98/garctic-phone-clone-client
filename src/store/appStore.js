import { create } from "zustand";

export const useAppStore = create((set) => ({
  isLoading: false,
  backgroundColor: "app",
  setLoading: (data) => set((state) => ({ isLoading: data })),
  setBgPrimary: () => {
    set((state) => ({ ...state, backgroundColor: "app" }));
  },
  setBgSecondary: () => {
    set((state) => ({ ...state, backgroundColor: "app secondary" }));
  },
}));
