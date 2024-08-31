import { List, ListItem } from "@mui/material";
import React from "react";
import { ChatListItem } from "./ChatListItem";
import "./style.css";

interface ChatListProps {
  chatList: { title: string; [key: string]: string }[];
}

export const ChatList: React.FC<ChatListProps> = ({ chatList = [] }) => {
  const [activeChat, setActiveChat] = React.useState<string | null>(null);

  const handleSelectActiveChat = (title: string) => {
    setActiveChat(title);
  };

  React.useEffect(() => {
    if (chatList.length > 0) {
      setActiveChat(chatList[0].title);
    }
  }, [chatList]);

  return (
    <List>
      {chatList.map((chatListItem) => {
        return (
          <ListItem key={chatListItem.title}>
            <ChatListItem
              title={chatListItem.title}
              onDelete={() => {
                console.log("[?] Delete chat", chatListItem.title);
              }}
              isActive={activeChat === chatListItem.title}
              setActiveChat={handleSelectActiveChat}
            />
          </ListItem>
        );
      })}
    </List>
  );
};
