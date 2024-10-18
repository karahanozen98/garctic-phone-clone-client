import { create } from "zustand";
import { httpClient } from "../httpClient";

export const useRoomStore = create((set) => ({
  room: null,
  getRoomById: async (id) => {
    const { data: room } = await httpClient.get(`/room/${id}`);
    set((state) => ({ room }));
  },
  setRoom: (room) => {
    set((state) => ({ room }));
  },
  joinRoom: async (id) => {
    await httpClient.put(`/room/${id}/join`);
  },
  startGame: async (id) => {
    await httpClient.put(`/room/${id}/start`);
  },
}));
