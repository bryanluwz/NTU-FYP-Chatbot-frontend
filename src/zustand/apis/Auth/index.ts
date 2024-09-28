import { create } from "zustand";
import { checkStatus, handleError } from "../../../apis/utils";
import { loginApi, registerUserApi } from "../../../apis/Auth";
import { UserInfoModel } from "../../../apis/ChatPage/typings";

interface AuthState {
  login: (
    email: string,
    password: string,
    callback: (token: string, user: UserInfoModel) => void
  ) => Promise<void>;
  register: (
    email: string,
    password: string,
    callback: (token: string, user: UserInfoModel) => void
  ) => Promise<void>;
}

const initialStates = {};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialStates,
  login: async (email: string, password: string, callback) => {
    try {
      const response = checkStatus(await loginApi({ email, password }));
      const { token, user } = response.data;
      callback(token, user);
      return;
    } catch (error) {
      handleError(error);
      return;
    }
  },
  register: async (email: string, password: string, callback) => {
    try {
      const response = checkStatus(await registerUserApi({ email, password }));
      const { token, user } = response.data;
      callback(token, user);
      return;
    } catch (error) {
      handleError(error);
      return;
    }
  },
}));
