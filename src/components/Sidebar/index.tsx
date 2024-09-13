import React from "react";

import { Button, ListItemIcon, ListItemText } from "@mui/material";
import { AccountBox } from "../AccountBox";
import { ChatList } from "../ChatList";

import { ChatListModel } from "../../apis/ChatPage/typings";
import { useChatPageStore } from "../../zustand/apis/ChatPage";

import AddIcon from "@mui/icons-material/Add";

import * as styles from "./style.scss";

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
      <Button onClick={() => {}}>
        <ListItemText>New Chat</ListItemText>
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
      </Button>
    </div>
  );
};
