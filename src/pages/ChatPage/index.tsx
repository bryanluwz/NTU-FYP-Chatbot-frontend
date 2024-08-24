import React from "react";

import { ChatArea } from "./components/ChatArea";
import { UserTypeEnum } from "../../enums";

export const ChatPage: React.FC = () => {
  return (
    <div>
      HELP
      <ChatArea messages={[{ message: "help", userType: UserTypeEnum.User }]} />
    </div>
  );
};
