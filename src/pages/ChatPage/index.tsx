import React from "react";

import { ChatArea } from "./components/ChatArea";
import { UserTypeEnum } from "../../enums";
import { Sidebar } from "../../components/Sidebar";

import * as styles from "./style.scss";

const fakeConversation = [
  { userType: UserTypeEnum.User, message: "Hello" },
  { userType: UserTypeEnum.AI, message: "Hi, how can I help you today?" },
  { userType: UserTypeEnum.User, message: "I need help with my account" },
  { userType: UserTypeEnum.AI, message: "Sure, what's your account number?" },
  { userType: UserTypeEnum.User, message: "123456" },
  {
    userType: UserTypeEnum.AI,
    message: "Thank you, how can I help you today?",
  },
];

export const ChatPage: React.FC = () => {
  return (
    <div className={styles.chatPageContainer}>
      <Sidebar />
      <ChatArea messages={fakeConversation} />
    </div>
  );
};
