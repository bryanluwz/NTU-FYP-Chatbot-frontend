import { create } from "zustand";
import { checkStatus, handleError } from "../../../apis/utils";
import { PersonaModel } from "../../../apis/Dashboard/typings";
import {
  deleteUserApi,
  getAvailableChatsApi,
  getUserListApi,
  udpatePasswordApi,
  updateUserApi,
} from "../../../apis/Dashboard";
import { UserInfoModel } from "../../../apis/ChatPage/typings";
import { useChatPageStore } from "../ChatPage";

interface DashboardState {
  availableChats: PersonaModel[];
  userList: UserInfoModel[];
  clearUserList: () => void;
  getAvailableChats: () => Promise<PersonaModel[]>;
  getUserList: () => Promise<void>;

  updateUser: (userInfo: UserInfoModel) => Promise<void>;
  deleteUser: (userInfo: UserInfoModel) => Promise<void>;
  udpatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
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
  updateUser: async (userInfo: UserInfoModel) => {
    try {
      const response = checkStatus(await updateUserApi(userInfo));
      get().getUserList();
      return;
    } catch (error) {
      handleError(error);
      return;
    }
  },
  deleteUser: async (userInfo: UserInfoModel) => {
    try {
      const response = checkStatus(await deleteUserApi(userInfo));
      get().getUserList();
      return;
    } catch (error) {
      handleError(error);
      return;
    }
  },
  udpatePassword: async (oldPassword: string, newPassword: string) => {
    try {
      const response = checkStatus(
        await udpatePasswordApi({ oldPassword, newPassword })
      );
      return;
    } catch (error) {
      handleError(error);
      return;
    }
  },
}));
