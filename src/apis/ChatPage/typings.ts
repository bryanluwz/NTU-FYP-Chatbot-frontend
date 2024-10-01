import { ChatUserTypeEnum, UserRoleEnum } from "../enums";
import { HTTPStatusBody } from "../typings";

// Models
export interface ChatMessageModel {
  messageId: string;
  userType: ChatUserTypeEnum;
  message: string;
}

export interface ChatListModel {
  chatId: string;
  chatName: string;
  updatedAt: number; // in timestamp
}

export interface MinimumChatInfoModel {
  chatId: string;
  chatName?: string;
}

export interface ChatInfoModel extends MinimumChatInfoModel {
  userId: string;
  messages: ChatMessageModel[];
  createdAt: number; // in timestamp
  updatedAt: number;
}

export interface UserInfoModel {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: UserRoleEnum;
}

export interface LoginRequestModel {
  email: string;
  password: string; // hashed
}

// Return types
export interface PostQueryMessageResponseModel {
  status: HTTPStatusBody;
  data: {
    message: ChatMessageModel;
  };
}

export interface GetChatListResponseModel {
  status: HTTPStatusBody;
  data: {
    chatList: ChatListModel[];
  };
}

export interface GetMinimumChatInfoResponseModel {
  status: HTTPStatusBody;
  data: {
    chatInfo: MinimumChatInfoModel;
  };
}

export interface GetChatInfoResponseModel {
  status: HTTPStatusBody;
  data: {
    chatInfo: ChatInfoModel;
  };
}

export interface GetUserInfoResponseModel {
  status: HTTPStatusBody;
  data: {
    userInfo: UserInfoModel;
  };
}
