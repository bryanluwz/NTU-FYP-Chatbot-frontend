import { HTTPStatusBody } from "../typings";

export interface AvailableChatModel {
  chatId: string;
  chatName: string;
  chatDescription: string;
}

export interface GetAvailableChatsResponseModel {
  status: HTTPStatusBody;
  data: {
    availableChats: AvailableChatModel[];
  };
}
