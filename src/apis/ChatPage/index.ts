import {
  GetChatListResponseModel,
  GetUserInfoResponseModel,
  PostQueryMessageResponseModel,
} from "./typings";
import { HTTPMethod } from "../typings";
import {
  getChatInfoUrl,
  getChatListUrl,
  getUserInfoUrl,
  queryChatMessageUrl,
} from "../urls";

export const postQueryMessageApi = async (data: any) => {
  return (await fetch(queryChatMessageUrl, {
    method: HTTPMethod.POST,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })) as unknown as PostQueryMessageResponseModel;
};

export const getChatListApi = async () => {
  return (
    await fetch(getChatListUrl, {
      method: HTTPMethod.GET,
    })
  ).json() as unknown as GetChatListResponseModel;
};

export const getChatInfoApi = async (chatId: string) => {
  return (await fetch(getChatInfoUrl(chatId), {
    method: HTTPMethod.GET,
  })) as unknown as GetChatListResponseModel;
};

export const getUserInfoApi = async () => {
  return (
    await fetch(getUserInfoUrl, {
      method: HTTPMethod.GET,
    })
  ).json() as unknown as GetUserInfoResponseModel;
};
