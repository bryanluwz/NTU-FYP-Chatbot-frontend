import React from "react";

import { Button } from "@mui/material";
import { AccountBox } from "../AccountBox";
import { ChatList } from "../ChatList";

import * as styles from "./style.scss";
import { ChatListModel } from "../../apis/ChatPage/typings";

interface SidebarProps {
  chatList: ChatListModel[];
  selectedChatId: string;
  setSelectedChatId: (chatId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  chatList = [],
  selectedChatId,
  setSelectedChatId,
}) => {
  return (
    <div className={styles.sidebarContainer}>
      <AccountBox />
      <ChatList
        chatList={chatList}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
      />
      <Button onClick={() => {}}>New Chat</Button>
    </div>
  );
};
