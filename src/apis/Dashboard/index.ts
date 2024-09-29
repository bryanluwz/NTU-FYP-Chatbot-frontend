import { UserInfoModel } from "../ChatPage/typings";
import { HTTPMethod } from "../typings";
import {
  deleteUserUrl,
  getAvailableChatsUrl,
  getUserListUrl,
  updateUserUrl,
} from "../urls";
import { fetchWithAuth } from "../utils";
import {
  GetPersonaResponseModel,
  GetUserListResponseModel,
  UpdateUserResponseModel,
} from "./typings";

export const getAvailableChatsApi = async () => {
  // In the future it is best to be able to specify how many chats to get
  return (
    await fetchWithAuth(getAvailableChatsUrl, {
      method: HTTPMethod.GET,
    })
  ).json() as unknown as GetPersonaResponseModel;
};

export const getUserListApi = async () => {
  return (
    await fetchWithAuth(getUserListUrl, {
      method: HTTPMethod.GET,
    })
  ).json() as unknown as GetUserListResponseModel;
};

export const updateUserApi = async (userInfo: UserInfoModel) => {
  return (
    await fetchWithAuth(updateUserUrl, {
      method: HTTPMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInfo: userInfo }),
    })
  ).json() as unknown as UpdateUserResponseModel;
};

export const deleteUserApi = async (userInfo: UserInfoModel) => {
  return (
    await fetchWithAuth(deleteUserUrl, {
      method: HTTPMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInfo: userInfo }),
    })
  ).json() as unknown as UpdateUserResponseModel;
};
