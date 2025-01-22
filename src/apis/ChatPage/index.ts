import {
  ChatMessageModel,
  GetChatInfoResponseModel,
  GetChatListResponseModel,
  GetMinimumChatInfoResponseModel,
  GetUserInfoResponseModel,
  GetUserSettingsResponseModel,
  MinimumChatInfoModel,
  PostQueryMessageResponseModel,
  UserChatMessageModel,
  UserSettingsModel,
} from "./typings";
import { HTTPMethod, HTTPStatusBody } from "../typings";
import {
  getChatListUrl,
  getUserInfoUrl,
  postQueryChatMessageUrl,
  updateChatMessageUrl,
  updateUserSettingsUrl,
} from "../urls";
import { fetchWithAuth } from "../utils";
import { urlToBlob, urlToFile } from "../../utils";

export const postQueryMessageApi = async (data: {
  chatId: string;
  message: UserChatMessageModel;
}) => {
  const formData = new FormData();

  formData.append(
    "messageInfo",
    JSON.stringify({
      chatId: data.chatId,
      message: JSON.stringify({
        messageId: data.message.messageId,
        userType: data.message.userType,
        message: data.message.message.text,
      } as ChatMessageModel),
    })
  );

  // Convert files and blobs and append to formData
  const filePromises = data.message.message.files.map(async (file) => {
    const appended = await urlToFile(file.url, file.name || "");

    if (appended) {
      formData.append("files", appended);
    }
  });

  // Wait for all file uploads to complete
  await Promise.all(filePromises);

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

export const getUserSettingsApi = async () => {
  return (
    await fetchWithAuth(updateUserSettingsUrl, {
      method: HTTPMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ actions: "get" }),
    })
  ).json() as unknown as GetUserSettingsResponseModel;
};

export const updateUserSettingsApi = async (body: {
  updatedUserSettings: UserSettingsModel;
}) => {
  return (
    await fetchWithAuth(updateUserSettingsUrl, {
      method: HTTPMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        actions: "update",
        userSettings: body.updatedUserSettings,
      }),
    })
  ).json() as unknown as GetUserSettingsResponseModel;
};
