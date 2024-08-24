import React from "react";
import { UserTypeEnum } from "../../../../enums";

interface ChatBoxProps {
  userType: UserTypeEnum;
  message: string;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ userType, message }) => {
  return (
    <div>
      <div>{userType}</div>
      <div>{message}</div>
    </div>
  );
};
