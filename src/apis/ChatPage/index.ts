import {
  GetChatInfoResponseModel,
  GetChatListResponseModel,
  GetMinimumChatInfoResponseModel,
  GetUserInfoResponseModel,
  MinimumChatInfoModel,
  PostQueryMessageResponseModel,
  UserChatMessageModel,
} from "./typings";
import { HTTPMethod, HTTPStatusBody } from "../typings";
import {
  getChatListUrl,
  getUserInfoUrl,
  postQueryChatMessageUrl,
  updateChatMessageUrl,
} from "../urls";
import { fetchWithAuth } from "../utils";

export const postQueryMessageApi = async (data: {
  chatId: string;
  message: UserChatMessageModel;
}) => {
  const formData = new FormData();

  formData.append("messageText", data.message.message.text);

  data.message.message.files.forEach((file) => {
    formData.append("files", file);
  });

  return (
    await fetchWithAuth(postQueryChatMessageUrl, {
      method: HTTPMethod.POST,
      body: formData,
    })
  ).json() as unknown as PostQueryMessageResponseModel;
};

export const getChatListApi = async () => {
  return (
    await fetchWithAuth(getChatListUrl, {
      method: HTTPMethod.GET,
    })
  ).json() as unknown as GetChatListResponseModel;
};

export const createChatApi = async (body: {
  userId: string;
  personaId: string;
}) => {
  return (
    await fetchWithAuth(updateChatMessageUrl, {
      method: HTTPMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "create",
        personaId: body.personaId,
        userId: body.userId,
      }),
    })
  ).json() as unknown as GetMinimumChatInfoResponseModel;
};

export const updateChatApi = async (body: {
  updatedChatModel: MinimumChatInfoModel;
}) => {
  return (
    await fetchWithAuth(updateChatMessageUrl, {
      method: HTTPMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "update", update: body.updatedChatModel }),
    })
  ).json() as unknown as GetMinimumChatInfoResponseModel;
};

export const deleteChatApi = async (body: { chatId: string }) => {
  return (
    await fetchWithAuth(updateChatMessageUrl, {
      method: HTTPMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "delete", chatId: body.chatId }),
    })
  ).json() as unknown as { status: HTTPStatusBody; data: {} };
};

export const getChatInfoApi = async (body: { chatId: string }) => {
  return (
    await fetchWithAuth(updateChatMessageUrl, {
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
    await fetchWithAuth(getUserInfoUrl, {
      method: HTTPMethod.GET,
    })
  ).json() as unknown as GetUserInfoResponseModel;
};
