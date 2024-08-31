import React from "react";

import { ChatArea } from "./components/ChatArea";
import { UserTypeEnum } from "../../enums";
import { Sidebar } from "../../components/Sidebar";

export const ChatPage: React.FC = () => {
  return (
    <div>
      <Sidebar />
      <ChatArea messages={[{ message: "help", userType: UserTypeEnum.User }]} />
    </div>
  );
};
