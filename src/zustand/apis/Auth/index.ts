import { create } from "zustand";
import { checkStatus, handleError } from "../../../apis/utils";
import { loginApi, registerUserApi } from "../../../apis/Auth";
import { UserInfoModel } from "../../../apis/ChatPage/typings";

interface AuthState {
  login: (
    email: string,
    password: string,
    callback: (token: string, user: UserInfoModel) => void
  ) => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string,
    callback: (token: string, user: UserInfoModel) => void
  ) => Promise<boolean>;
}

const initialStates = {};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialStates,
  login: async (email: string, password: string, callback) => {
    try {
      const response = checkStatus(await loginApi({ email, password }));
      const { token, user } = response.data;
      callback(token, user);
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  },
  register: async (
    username: string,
    email: string,
    password: string,
    callback
  ) => {
    try {
      const response = checkStatus(
        await registerUserApi({ username, email, password })
      );
      const { token, user } = response.data;
      callback(token, user);
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  },
}));
