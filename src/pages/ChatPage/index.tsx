import React from "react";

import { ChatArea } from "./components/ChatArea";
import { Sidebar } from "../../components/Sidebar";

import * as styles from "./style.scss";
import { useChatPageStore } from "../../zustand/apis/ChatPage";

export const ChatPage: React.FC = () => {
  const { messages, setMessages, appendMessage } = useChatPageStore();

  return (
    <div className={styles.chatPageContainer}>
      <Sidebar />
      <ChatArea messages={messages} appendMessage={appendMessage} />
    </div>
  );
};
