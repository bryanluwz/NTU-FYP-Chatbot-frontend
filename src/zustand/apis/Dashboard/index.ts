import { create } from "zustand";
import { checkStatus, handleError } from "../../../apis/utils";
import { PersonaModel } from "../../../apis/Dashboard/typings";
import { getAvailableChatsApi, getUserListApi } from "../../../apis/Dashboard";
import { UserInfoModel } from "../../../apis/ChatPage/typings";

interface DashboardState {
  availableChats: PersonaModel[];
  userList: UserInfoModel[];
  clearUserList: () => void;
  getAvailableChats: () => Promise<PersonaModel[]>;
  getUserList: () => Promise<void>;
}

const initialStates = {
  availableChats: [],
  userList: [],
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
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
  getUserList: async () => {
    try {
      const response = checkStatus(await getUserListApi());
      const users = response.data.users;
      set({ userList: users });
      return;
    } catch (error) {
      get().clearUserList();
      handleError(error);
      return;
    }
  },
  clearUserList: () => set({ userList: [] }),
}));
