import React from "react";

import { List, ListItem } from "@mui/material";
import { ChatListItem } from "./ChatListItem";
import { ChatListModel } from "../../apis/ChatPage/typings";

import "./style.css";
import { useChatPageStore } from "../../zustand/apis/ChatPage";
import { TabEnum } from "../../apis/enums";

interface ChatListProps {
  chatList: ChatListModel[];
  selectedChatId: string;
  setSelectedChatId: (chatId: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chatList = [],
  selectedChatId,
  setSelectedChatId,
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
    <List>
      {chatList.map((chatListItem) => {
        return (
          <ListItem key={chatListItem.chatId}>
            <ChatListItem
              id={chatListItem.chatId}
              title={chatListItem.chatName}
              onDelete={() => {
                console.log("[?] Delete chat", chatListItem.chatName);
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
