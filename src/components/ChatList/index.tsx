import React from "react";

import { List, ListItem } from "@mui/material";
import { ChatListItem } from "./ChatListItem";
import { ChatListModel } from "../../apis/ChatPage/typings";

import "./style.css";

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
  React.useEffect(() => {
    setSelectedChatId(selectedChatId);
  }, [selectedChatId]);

  const handleSelectActiveChat = (chatId: string) => {
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
