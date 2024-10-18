import { create } from "zustand";
import { httpClient } from "../httpClient";

export const useAuthSore = create((set) => ({
  user: null,
  login: async ({ username, password }) => {
    httpClient
      .post("/authentication/login", {
        username,
        password,
      })
      .then(({ data: user }) => set((state) => ({ user: user })));
  },
  logout: () => set({ user: null }),
  me: async () => {
    try {
      const response = await httpClient.get("/authentication/me");
      set((state) => ({ user: response.data }));
    } catch (error) {}
  },
}));
