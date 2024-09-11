import React from "react";

import { Button } from "@mui/material";
import { AccountBox } from "../AccountBox";
import { ChatList } from "../ChatList";

import * as styles from "./style.scss";
import { ChatListModel } from "../../apis/ChatPage/typings";
import { useChatPageStore } from "../../zustand/apis/ChatPage";

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
  const { userInfo } = useChatPageStore();

  return (
    <div className={styles.sidebarContainer}>
      <AccountBox username={userInfo.username} userAvatar={userInfo.avatar} />
      <ChatList
        chatList={chatList}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
      />
      <Button onClick={() => {}}>New Chat</Button>
    </div>
  );
};
