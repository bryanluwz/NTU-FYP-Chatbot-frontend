import React from "react";

import { ChatArea } from "./components/ChatArea";
import { Sidebar } from "../../components/Sidebar";

import * as styles from "./style.scss";
import { useChatPageStore } from "../../zustand/apis/ChatPage";

export const ChatPage: React.FC = () => {
  const {
    messages,
    chatList,
    currentChatInfo,
    isLoading,
    setMessages,
    appendMessage,
    getChatList,
    getChatInfo,
  } = useChatPageStore();

  const [selectedChatId, setSelectedChatId] = React.useState("");
  const [selectedChatInfo, setSelectedChatInfo] =
    React.useState(currentChatInfo);

  // 1. Load chat list
  React.useEffect(() => {
    getChatList();
  }, []);

  // 2. Update selected chat list id when chat list is loaded
  React.useEffect(() => {
    if (chatList.length > 0) {
      setSelectedChatId(chatList[0].chatId);
    }
  }, [chatList]);

  // 3. Load chat info when selected chat id is updated
  React.useEffect(() => {
    getChatInfo(selectedChatId);
  }, [selectedChatId]);

  // 4. Update selected chat info when chat info is loaded
  React.useEffect(() => {
    setSelectedChatInfo(currentChatInfo);
  }, [currentChatInfo]);

  // 5. Update messages when selected chat info is updated
  React.useEffect(() => {
    if (selectedChatInfo?.messages) {
      setMessages(selectedChatInfo.messages);
    }
  }, [selectedChatInfo]);

  return (
    <div className={styles.chatPageContainer}>
      <Sidebar
        chatList={chatList}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
      />
      <ChatArea isLoading={isLoading} messages={messages} />
    </div>
  );
};
