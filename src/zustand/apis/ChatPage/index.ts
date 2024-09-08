import { createStore, create } from "zustand";
import { checkStatus, handleError } from "../../../apis/utils";
import { getChatListApi, postQueryMessageApi } from "../../../apis/ChatPage";
import {
  ChatInfoModel,
  ChatListModel,
  ChatMessageModel,
} from "../../../apis/ChatPage/typings";
import { UserTypeEnum } from "../../../apis/enums";
import {
  getChatInfoMockData,
  getChatListMockData,
  postQueryMessageMockData,
} from "./mockdata";

interface ChatPageState {
  messages: ChatMessageModel[];
  chatList: ChatListModel[];
  currentChatInfo: ChatInfoModel;

  setMessages: (messages: ChatMessageModel[]) => void;
  appendMessage: (message: ChatMessageModel) => void;
  replaceLastMessage: (message: ChatMessageModel) => void;
  postQueryMessage: (userMessage: string) => Promise<string>;

  getChatList: () => Promise<ChatListModel[]>;
  getChatInfo: (chatId: string) => Promise<ChatInfoModel>;
}

const initialStates = {
  messages: [],
  chatList: [],
  currentChatInfo: {
    chatId: "",
    chatName: "",
    messages: [],
  },
};

export const useChatPageStore = create<ChatPageState>((set) => ({
  ...initialStates,
  setMessages: (messages: ChatMessageModel[]) => {
    set({ messages });
  },
  appendMessage: (message: ChatMessageModel) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },
  replaceLastMessage: (message: ChatMessageModel) =>
    set((state) => {
      const messages = [...state.messages];
      messages[messages.length - 1] = message;
      return { messages };
    }),
  postQueryMessage: async (userMessage: string) => {
    try {
      // Append the user message to the messages
      set((state) => ({
        messages: [
          ...state.messages,
          {
            messageId: Date.now().toString(),
            userType: UserTypeEnum.User,
            message: userMessage,
          },
        ],
      }));

      // Receive the AI response, should update the database with the user message and ai response
      // const response = checkStatus(await postQueryMessageApi({ userMessage }));

      const response = checkStatus(await postQueryMessageMockData());
      const { message: responseMessage } = response.data;

      // Simulate a delay using a Promise
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Append the AI response to the messages
      set((state) => ({
        messages: [
          ...state.messages,
          {
            messageId: Date.now().toString(),
            userType: UserTypeEnum.AI,
            message: responseMessage,
          },
        ],
      }));

      return responseMessage;
    } catch (error) {
      handleError(error);
      return "";
    }
  },
  getChatList: async () => {
    try {
      // const response = checkStatus(await getChatListApi());
      const response = checkStatus(getChatListMockData);
      set({ chatList: response.data.chatList });
      return response.data.chatList;
    } catch (error) {
      handleError(error);
      return [];
    }
  },
  getChatInfo: async (chatId: string) => {
    try {
      // const response = checkStatus(await getChatInfoApi(chatId));
      const response = checkStatus(await getChatInfoMockData(chatId));
      set({ currentChatInfo: response.data.chatInfo });
      return response.data.chatInfo;
    } catch (error) {
      handleError(error);
      return {
        chatId: "",
        chatName: "",
        messages: [],
      };
    }
  },
}));
