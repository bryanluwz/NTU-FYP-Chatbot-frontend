import { create } from "zustand";
import { checkStatus, handleError } from "../../../apis/utils";
import { PersonaModel } from "../../../apis/Dashboard/typings";
import { getAvailableChatsApi } from "../../../apis/Dashboard";

interface DashboardState {
  availableChats: PersonaModel[];
  getAvailableChats: () => Promise<PersonaModel[]>;
}

const initialStates = {
  availableChats: [],
};

export const useDashboardStore = create<DashboardState>((set) => ({
  ...initialStates,
  getAvailableChats: async () => {
    try {
      const response = checkStatus(await getAvailableChatsApi());
      set({ availableChats: response.data.personas });
      return response.data.personas;
    } catch (error) {
      handleError(error);
      return [];
    }
  },
}));
