import { UserInfoModel } from "../ChatPage/typings";
import { HTTPMethod } from "../typings";
import {
  deleteUserUrl,
  getUserListUrl,
  updatePasswordUrl,
  updateUserUrl,
} from "../urls";
import { fetchWithAuth } from "../utils";
import { GetUserListResponseModel, UpdateUserResponseModel } from "./typings";

export const getUserListApi = async () => {
  return (
    await fetchWithAuth(getUserListUrl, {
      method: HTTPMethod.GET,
    })
  ).json() as unknown as GetUserListResponseModel;
};

export const updateUserApi = async (userInfo: UserInfoModel) => {
  const formData = new FormData();

  formData.append(
    "userInfo",
    JSON.stringify({ ...userInfo, avatar: undefined })
  );

  // Append the avatar as a file blob (if one is provded)
  if (userInfo.avatar !== undefined) {
    const blob = await (await fetch(userInfo.avatar)).blob(); // Convert base64 to Blob
    formData.append("avatar", blob, `${userInfo.username}_avatar.png`); // You can change the filename if needed
  }

  return (
    await fetchWithAuth(updateUserUrl, {
      method: HTTPMethod.POST,
      body: formData,
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

export const updatePasswordApi = async (body: {
  oldPassword: string;
  newPassword: string;
}) => {
  return (
    await fetchWithAuth(updatePasswordUrl, {
      method: HTTPMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
  ).json() as unknown as UpdateUserResponseModel;
};
