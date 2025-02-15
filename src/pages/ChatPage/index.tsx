import React from "react";

import { ChatArea } from "./components/ChatArea";
import { Sidebar } from "../../components/Sidebar";

import { useChatPageStore } from "../../zustand/apis/ChatPage";
import { Dashboard } from "./components/Dashboard";
import { TabEnum, UserRoleEnum } from "../../apis/enums";

import * as styles from "./style.scss";
import { AdminDashboard } from "./components/AdminDashboard";
import { ChatInfoModel } from "../../apis/ChatPage/typings";
import { PersonaDashboard } from "./components/PersonaDashboard";
import { usePersonaStore } from "../../zustand/apis/Persona";

export const ChatPage: React.FC = () => {
  const {
    messages,
    chatList,
    currentChatInfo,
    isLoading,
    currentTab,
    userInfo,
    setMessages,
    getChatList,
    getChatInfo,
    getUserInfo,
    createChat,
    deleteChat,
    setCurrentTab,
  } = useChatPageStore();

  const { getPersona } = usePersonaStore();

  const [selectedChatId, setSelectedChatId] = React.useState("");
  const [selectedChatInfo, setSelectedChatInfo] = React.useState<
    ChatInfoModel | undefined
  >(currentChatInfo);

  // To handle chat loading
  // 0. Initial load
  React.useEffect(() => {
    getUserInfo();
  }, []);

  // 1. Load chat list
  React.useEffect(() => {
    getChatList();
  }, [userInfo]);

  // 2. Update selected chat list id when chat list is loaded
  React.useEffect(() => {
    if (chatList.length > 0) {
      setSelectedChatId(chatList[0].chatId);
    } else {
      setSelectedChatId("");
    }
  }, [chatList]);

  // 3. Load chat info when selected chat id is updated
  React.useEffect(() => {
    if (selectedChatId && selectedChatId !== "") {
      getChatInfo(selectedChatId);
      setCurrentTab(TabEnum.Chat);
    } else if (currentTab === TabEnum.Chat) {
      setSelectedChatInfo(undefined);
      setCurrentTab(TabEnum.Dashboard);
    }
  }, [selectedChatId]);

  // 4. Update selected chat info when chat info is loaded
  React.useEffect(() => {
    setSelectedChatInfo(currentChatInfo);
  }, [currentChatInfo]);

  // 5. Update messages when selected chat info is updated
  React.useEffect(() => {
    if (selectedChatInfo?.chatId) getPersona(selectedChatInfo?.chatId);

    if (selectedChatInfo?.messages) {
      setMessages(selectedChatInfo.messages);
    } else {
      setMessages([]);
    }
  }, [selectedChatInfo]);

  // To handle switch between dashboard and chat area
  const tabContent = React.useMemo(() => {
    switch (currentTab) {
      case TabEnum.Chat:
        return <ChatArea isLoading={isLoading} messages={messages} />;
      case TabEnum.Dashboard:
        return <Dashboard setSelectedChatId={setSelectedChatId} />;
      case TabEnum.Admin:
        if (userInfo.role === UserRoleEnum.Admin) {
          return <AdminDashboard />;
        }
      case TabEnum.Persona:
        if (
          userInfo.role === UserRoleEnum.Admin ||
          userInfo.role === UserRoleEnum.Educator
        ) {
          return <PersonaDashboard />;
        }
      default:
        return <Dashboard setSelectedChatId={setSelectedChatId} />;
    }
  }, [currentTab, isLoading, messages]);

  React.useEffect(() => {
    if (currentTab !== TabEnum.Chat) {
      setSelectedChatId("");
    }
  }, [currentTab]);

  return (
    <div className={styles.chatPageContainer}>
      <Sidebar
        chatList={chatList}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
      />
      {tabContent}
    </div>
  );
};
