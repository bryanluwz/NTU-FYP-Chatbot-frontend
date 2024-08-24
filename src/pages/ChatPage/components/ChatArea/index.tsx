import React from "react";
import { ChatBox } from "../ChatBox";
import { UserTypeEnum } from "../../../../enums";

interface ChatAreaProps {
  messages: { userType: UserTypeEnum; message: string }[];
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages }) => {
  return (
    <div>
      {messages.map((message) => (
        <ChatBox userType={message.userType} message={message.message} />
      ))}
    </div>
  );
};
