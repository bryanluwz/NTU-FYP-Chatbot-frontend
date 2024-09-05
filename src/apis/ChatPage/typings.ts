import { ReactElement } from "react";
import { UserTypeEnum } from "../enums";
import { HTTPStatusBody } from "../typings";

// Models
export interface ChatMessageModel {
  messageId: string;
  userType: UserTypeEnum;
  message: string;
}

// Return types
export interface PostQueryMessageResponseModel {
  status: HTTPStatusBody;
  message: string;
}
