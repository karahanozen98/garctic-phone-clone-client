import { create } from "zustand";

export const useAppSore = create((set) => ({
  isLoading: false,
  setLoading: (data) => set((state) => ({ isLoading: data })),
}));
