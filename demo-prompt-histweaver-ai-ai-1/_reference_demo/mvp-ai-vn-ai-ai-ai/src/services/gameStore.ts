import { create } from "zustand";
import type { EndingPayload, GameMode } from "../types";

type AppScreen = "home" | "character" | "game" | "ending";

type GameStore = {
  screen: AppScreen;
  mode: GameMode;
  playerRoleId: string | null;
  endingPayload: EndingPayload | null;
  setMode: (mode: GameMode) => void;
  openCharacterSelect: () => void;
  startGame: (playerRoleId: string) => void;
  finishGame: (payload: EndingPayload) => void;
  restart: () => void;
};

export const useGameStore = create<GameStore>((set) => ({
  screen: "home",
  mode: "historical",
  playerRoleId: null,
  endingPayload: null,
  setMode: (mode) => set({ mode }),
  openCharacterSelect: () => set({ screen: "character", endingPayload: null }),
  startGame: (playerRoleId) => set({ screen: "game", playerRoleId, endingPayload: null }),
  finishGame: (payload) => set({ screen: "ending", endingPayload: payload }),
  restart: () => set({ screen: "home", playerRoleId: null, endingPayload: null })
}));
