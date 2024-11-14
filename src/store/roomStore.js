import { create } from "zustand";
import { httpClient } from "../httpClient";

export const useRoomStore = create((set) => ({
  room: null,
  quest: null,
  players: [],
  showcase: [],
  getRoomById: async (id) => {
    const { data: room } = await httpClient.get(`/room/${id}`);
    set((state) => ({ ...state, room, players: room.players }));
  },
  setRoom: (room) => {
    set((state) => ({ ...state, room, players: room.players }));
  },
  updatePlayers: (players) => {
    set((state) => ({ ...state, players }));
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
  sendDrawing: async (id, { drawing }) => {
    await httpClient.put(`/room/${id}/drawing`, { drawing });
  },
  getMyQuest: async (id) => {
    const { data: quest } = await httpClient.get(`/room/${id}/getMyQuest`);
    set(() => ({ quest }));
  },
  getShowcase: async (id) => {
    const { data } = await httpClient.get(`/room/${id}/getShowcase`);
    set((state) => ({ ...state, showcase: data }));
  },
  moveToNextShowcase: async (id) => {
    await httpClient.put(`/room/${id}/moveToNextShowcase`);
  },
  setShowcase: (showcase) => {
    set((state) => ({ ...state, showcase }));
  },
}));
