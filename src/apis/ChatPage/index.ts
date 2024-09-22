import {
  ChatInfoModel,
  GetChatInfoResponseModel,
  GetChatListResponseModel,
  GetUserInfoResponseModel,
  PostQueryMessageResponseModel,
} from "./typings";
import { HTTPMethod } from "../typings";
import {
  getChatListUrl,
  getUserInfoUrl,
  postQueryChatMessageUrl,
  updateChatMessageUrl,
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

export const createChatApi = async (body: { chatId: string }) => {
  return (
    await fetch(updateChatMessageUrl, {
      method: HTTPMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "create", chatId: body.chatId }),
    })
  ).json() as unknown as GetChatInfoResponseModel;
};

export const updateChatApi = async (body: {
  updatedChatModel: ChatInfoModel;
}) => {
  return (
    await fetch(updateChatMessageUrl, {
      method: HTTPMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "update", update: body.updatedChatModel }),
    })
  ).json() as unknown as GetChatInfoResponseModel;
};

export const deleteChatApi = async (body: { chatId: string }) => {
  return (
    await fetch(updateChatMessageUrl, {
      method: HTTPMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "delete", chatId: body.chatId }),
    })
  ).json() as unknown as GetChatInfoResponseModel;
};

export const getChatInfoApi = async (body: { chatId: string }) => {
  return (
    await fetch(updateChatMessageUrl, {
      method: HTTPMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "get", chatId: body.chatId }),
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
