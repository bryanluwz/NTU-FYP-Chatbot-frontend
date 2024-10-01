import { create } from "zustand";
import { checkStatus, handleError } from "../../../apis/utils";
import { PersonaModel } from "../../../apis/Dashboard/typings";
import {
  deleteUserApi,
  getAvailableChatsApi,
  getUserListApi,
  updatePasswordApi,
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
  updatePassword: (
    oldPassword: string,
    newPassword: string
  ) => Promise<boolean>;
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
  updatePassword: async (oldPassword: string, newPassword: string) => {
    try {
      const response = checkStatus(
        await updatePasswordApi({ oldPassword, newPassword })
      );
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  },
}));
