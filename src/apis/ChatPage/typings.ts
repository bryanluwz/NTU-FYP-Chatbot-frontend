import { ReactElement } from "react";
import { UserTypeEnum } from "../enums";
import { HTTPStatusBody } from "../typings";

// Models
export interface ChatMessageModel {
  messageId: string;
  userType: UserTypeEnum;
  message: string;
}

export interface ChatListModel {
  chatId: string;
  chatName: string;
}

export interface ChatInfoModel {
  chatId: string;
  chatName: string;
  messages: ChatMessageModel[];
}

// Return types
export interface PostQueryMessageResponseModel {
  status: HTTPStatusBody;
  data: {
    message: string;
  };
}

export interface GetChatListResponseModel {
  status: HTTPStatusBody;
  data: {
    chatList: ChatListModel[];
  };
}

export interface GetChatInfoResponseModel {
  status: HTTPStatusBody;
  data: {
    chatInfo: ChatInfoModel;
  };
}
