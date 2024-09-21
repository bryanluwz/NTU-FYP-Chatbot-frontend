import {
  GetChatInfoResponseModel,
  GetChatListResponseModel,
  GetUserInfoResponseModel,
  PostQueryMessageResponseModel,
} from "./typings";
import { HTTPMethod } from "../typings";
import {
  getChatInfoUrl,
  getChatListUrl,
  getUserInfoUrl,
  postQueryChatMessageUrl,
} from "../urls";

export const postQueryMessageApi = async (data: any) => {
  return (
    await fetch(postQueryChatMessageUrl, {
      method: HTTPMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  ).json() as unknown as PostQueryMessageResponseModel;
};

export const getChatListApi = async () => {
  return (
    await fetch(getChatListUrl, {
      method: HTTPMethod.GET,
    })
  ).json() as unknown as GetChatListResponseModel;
};

export const getChatInfoApi = async (body: { chatId: string }) => {
  return (
    await fetch(getChatInfoUrl(body.chatId), {
      method: HTTPMethod.GET,
    })
  ).json() as unknown as GetChatInfoResponseModel;
};

export const getUserInfoApi = async () => {
  return (
    await fetch(getUserInfoUrl, {
      method: HTTPMethod.GET,
    })
  ).json() as unknown as GetUserInfoResponseModel;
};
