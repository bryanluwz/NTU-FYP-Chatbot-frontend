import { create } from "zustand";
import { checkStatus, handleError } from "../../../apis/utils";
import { getAvailableChatsMockData } from "./mockdata";
import { AvailableChatModel } from "../../../apis/Dashboard/typings";
import { getAvailableChatsApi } from "../../../apis/Dashboard";

interface DashboardState {
  availableChats: AvailableChatModel[];
  getAvailableChats: () => Promise<AvailableChatModel[]>;
}

const initialStates = {
  availableChats: [],
};

export const useDashboardStore = create<DashboardState>((set) => ({
  ...initialStates,
  getAvailableChats: async () => {
    try {
      const response = checkStatus(await getAvailableChatsApi());
      set({ availableChats: response.data.availableChats });
      return response.data.availableChats;
    } catch (error) {
      handleError(error);
      return [];
    }
  },
}));
