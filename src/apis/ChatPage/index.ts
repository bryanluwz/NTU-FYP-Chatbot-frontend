import {
  ChatInfoModel,
  GetChatInfoResponseModel,
  GetChatListResponseModel,
  GetMinimumChatInfoResponseModel,
  GetUserInfoResponseModel,
  MinimumChatInfoModel,
  PostQueryMessageResponseModel,
} from "./typings";
import { HTTPMethod, HTTPStatusBody } from "../typings";
import {
  getChatListUrl,
  getUserInfoUrl,
  postQueryChatMessageUrl,
  updateChatMessageUrl,
} from "../urls";
import { fetchWithAuth } from "../utils";

export const postQueryMessageApi = async function* (
  data: any
): AsyncGenerator<PostQueryMessageResponseModel, void, unknown> {
  console.log("postQueryMessageApi", data);
  const response = await fetchWithAuth(postQueryChatMessageUrl, {
    method: HTTPMethod.POST,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const contentType = response.headers.get("Content-Type");

  if (contentType && contentType.includes("application/json")) {
    // If the response is JSON, yield it directly
    const jsonResponse =
      (await response.json()) as PostQueryMessageResponseModel;
    yield jsonResponse;
  } else if (contentType && contentType.includes("text/event-stream")) {
    // If the response is a stream, handle it as such
    const reader = response.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        // Assuming the chunk contains string data, parse it
        try {
          const parsedChunk = JSON.parse(
            chunk
          ) as PostQueryMessageResponseModel;
          yield parsedChunk; // Yield the parsed chunk
        } catch (error) {
          console.error("Failed to parse chunk:", error);
        }
      }
    } else {
      throw new Error("Failed to read response body");
    }
  } else {
    throw new Error("Unsupported content type: " + contentType);
  }
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
