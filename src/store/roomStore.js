import { create } from "zustand";
import { httpClient } from "../httpClient";

export const useRoomStore = create((set) => ({
  room: null,
  quest: null,
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
  sendSentence: async (id, sentence) => {
    await httpClient.put(`/room/${id}/sentence`, { sentence });
  },
  sendDrawing: async (id, { quest, drawing }) => {
    await httpClient.put(`/room/${id}/drawing`, { quest, drawing });
  },
  getMyQuest: async (id) => {
    const { data: quest } = await httpClient.get(`/room/${id}/getMyQuest`);
    set(() => ({ quest }));
  },
}));
