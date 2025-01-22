import { ChatUserTypeEnum, UserRoleEnum } from "../enums";
import { HTTPStatusBody } from "../typings";

// Models
interface BaseMessageModel {
  messageId: string;
  userType: ChatUserTypeEnum;
}

export interface ChatMessageModel extends BaseMessageModel {
  message: string;
}

export interface UserChatMessageModel extends BaseMessageModel {
  message: {
    text: string;
    files: { url: string; type: string; name?: string }[]; // asset pointer to local uploaded files, type is either "blob" or "file"
  };
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

export interface UserSettingsModel {
  ttsName: string;
}

// Return types
export interface PostQueryMessageResponseModel {
  status: HTTPStatusBody;
  data: {
    message: ChatMessageModel | UserChatMessageModel;
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

export interface GetUserSettingsResponseModel {
  status: HTTPStatusBody;
  data: {
    settings: UserSettingsModel;
  };
}
