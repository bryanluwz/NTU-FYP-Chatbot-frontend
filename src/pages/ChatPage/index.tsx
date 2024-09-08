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
    setMessages,
    appendMessage,
    getChatList,
    getChatInfo,
  } = useChatPageStore();

  const [selectedChatId, setSelectedChatId] = React.useState("");

  React.useEffect(() => {
    getChatList().then((chatList) => {
      if (chatList.length > 0) {
        setSelectedChatId(chatList[0].chatId);
      }
    });
  }, []);

  React.useEffect(() => {
    getChatInfo(selectedChatId).then((chatInfo) => {
      setMessages(chatInfo.messages);
    });
  }, [selectedChatId]);

  return (
    <div className={styles.chatPageContainer}>
      <Sidebar
        chatList={chatList}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
      />
      <ChatArea messages={messages} appendMessage={appendMessage} />
    </div>
  );
};
