import React from "react";

import { Button, ListItemIcon, ListItemText } from "@mui/material";
import { AccountBox } from "../AccountBox";
import { ChatList } from "../ChatList";

import { ChatListModel } from "../../apis/ChatPage/typings";
import { useChatPageStore } from "../../zustand/apis/ChatPage";

import AddIcon from "@mui/icons-material/Add";

import * as styles from "./style.scss";
import { TabEnum } from "../../apis/enums";

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
  const {
    userInfo,
    currentTab,
    setCurrentTab,
    deleteChat,
    getChatList,
    isProcessing,
  } = useChatPageStore();

  const handleNewChat = () => {
    if (currentTab !== TabEnum.Dashboard) {
      setCurrentTab(TabEnum.Dashboard);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    await deleteChat(chatId);
    await getChatList();
  };

  return (
    <div className={styles.sidebarContainer}>
      <AccountBox
        username={userInfo.username}
        userAvatar={userInfo.avatar}
        disabled={isProcessing}
      />
      <ChatList
        chatList={chatList}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        deleteChat={handleDeleteChat}
        disabled={isProcessing}
      />
      <Button onClick={handleNewChat} disabled={isProcessing}>
        <ListItemText>New Chat</ListItemText>
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
      </Button>
    </div>
  );
};
