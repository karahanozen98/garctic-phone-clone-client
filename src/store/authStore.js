import { create } from "zustand";
import { httpClient } from "../httpClient";

export const useAuthSore = create((set) => ({
  user: null,
  login: async ({ username, password }) => {
    const { data } = await httpClient.post("/authentication/login", {
      username,
      password,
    });
    set((state) => ({ user: data }));
  },
  logout: async () => {
    await httpClient.post("/authentication/logout");
    window.location.href = "/login";
  },
  handleAuthentication: async () => {
    try {
      const { data } = await httpClient.get("/authentication/me");
      set((state) => ({ user: data }));
    } catch (error) {
      document.cookie.replace("token", "");
      window.location.href = "/login";
    }
  },
}));
