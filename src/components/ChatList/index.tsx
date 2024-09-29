import React from "react";

import { List, ListItem } from "@mui/material";
import { ChatListItem } from "./ChatListItem";
import { ChatListModel } from "../../apis/ChatPage/typings";

import { useChatPageStore } from "../../zustand/apis/ChatPage";
import { TabEnum } from "../../apis/enums";

import * as styles from "./style.scss";
import "./style.css";

interface ChatListProps {
  chatList: ChatListModel[];
  selectedChatId: string;
  setSelectedChatId: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chatList = [],
  selectedChatId,
  setSelectedChatId,
  deleteChat,
}) => {
  const { currentTab, setCurrentTab } = useChatPageStore();

  React.useEffect(() => {
    setSelectedChatId(selectedChatId);
  }, [selectedChatId]);

  const handleSelectActiveChat = (chatId: string) => {
    if (currentTab !== TabEnum.Chat) {
      setCurrentTab(TabEnum.Chat);
    }
    setSelectedChatId(chatId);
  };

  return (
    <List className={styles.chatListContainer}>
      {chatList
        .sort((a, b) => {
          if (a.updatedAt > b.updatedAt) return -1;
          if (a.updatedAt < b.updatedAt) return 1;
          return 0;
        })
        .map((chatListItem) => {
          return (
            <ListItem key={chatListItem.chatId}>
              <ChatListItem
                id={chatListItem.chatId}
                title={chatListItem.chatName}
                onDelete={() => {
                  deleteChat(chatListItem.chatId);
                }}
                isActive={selectedChatId === chatListItem.chatId}
                setActiveChat={handleSelectActiveChat}
              />
            </ListItem>
          );
        })}
    </List>
  );
};
