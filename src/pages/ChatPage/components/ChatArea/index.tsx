import React from "react";
import { ChatMessageBox } from "../ChatMessageBox";
import { UserTypeEnum } from "../../../../enums";
import * as styles from "./style.scss";

interface ChatAreaProps {
  messages: { userType: UserTypeEnum; message: string }[];
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages }) => {
  return (
    <div className={styles.chatAreaContainer}>
      {messages.map((message) => (
        <ChatMessageBox userType={message.userType} message={message.message} />
      ))}
    </div>
  );
};
