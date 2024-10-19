import { create } from "zustand";
import { checkStatus, handleError } from "../../../apis/utils";
import {
  deleteUserApi,
  getUserListApi,
  updatePasswordApi,
  updateUserApi,
} from "../../../apis/Dashboard";
import { UserInfoModel } from "../../../apis/ChatPage/typings";
import { useChatPageStore } from "../ChatPage";
import { PersonaModel } from "../../../apis/Persona/typings";
import { getAvailablePersonasApi } from "../../../apis/Persona";

interface DashboardState {
  userList: UserInfoModel[];
  clearUserList: () => void;
  getUserList: () => Promise<void>;

  updateUser: (userInfo: UserInfoModel) => Promise<void>;
  deleteUser: (userInfo: UserInfoModel) => Promise<void>;
  updatePassword: (
    oldPassword: string,
    newPassword: string
  ) => Promise<boolean>;
}

const initialStates = {
  userList: [],
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  ...initialStates,
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
