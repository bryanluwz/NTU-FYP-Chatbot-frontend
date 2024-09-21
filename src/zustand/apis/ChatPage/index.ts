import { create } from "zustand";
import { checkStatus, handleError } from "../../../apis/utils";
import {
  getChatInfoApi,
  getChatListApi,
  getUserInfoApi,
  postQueryMessageApi,
} from "../../../apis/ChatPage";
import {
  ChatInfoModel,
  ChatListModel,
  ChatMessageModel,
  UserInfoModel,
} from "../../../apis/ChatPage/typings";
import { TabEnum, UserTypeEnum } from "../../../apis/enums";
import {
  getChatInfoMockData,
  getChatListMockData,
  getUserInfoMockData,
  postQueryMessageMockData,
} from "./mockdata";
import DefaultUserAvatar from "../../../assets/user-avatar-default.png";

interface ChatPageState {
  messages: ChatMessageModel[];
  chatList: ChatListModel[];
  currentChatInfo: ChatInfoModel;
  isLoading: boolean;
  currentTab: TabEnum;

  userInfo: UserInfoModel;

  setMessages: (messages: ChatMessageModel[]) => void;
  appendMessage: (message: ChatMessageModel) => void;
  replaceLastMessage: (message: ChatMessageModel) => void;
  postQueryMessage: (userMessage: string) => Promise<string>;

  getChatList: () => Promise<ChatListModel[]>;
  getChatInfo: (chatId: string) => Promise<ChatInfoModel>;

  setCurrentTab: (tab: TabEnum) => void;

  getUserInfo: () => Promise<UserInfoModel>;
}

const initialStates = {
  messages: [],
  chatList: [],
  currentChatInfo: {
    chatId: "",
    chatName: "",
    messages: [],
  },
  isLoading: false,
  currentTab: TabEnum.Chat,
  userInfo: {
    username: "",
    email: "",
    avatar: DefaultUserAvatar,
  },
};

export const useChatPageStore = create<ChatPageState>((set, get) => ({
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

      const chatId = get().currentChatInfo.chatId;

      // Receive the AI response, should update the database with the user message and ai response
      const response = checkStatus(
        await postQueryMessageApi({ chatId, message: userMessage })
      );

      console.log(response);

      const { message: responseMessage } = response.data;

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
      set({ isLoading: false });
      return "";
    }
  },
  getChatList: async () => {
    try {
      set({ isLoading: true });
      const response = checkStatus(await getChatListApi());

      set({ chatList: response.data.chatList });
      set({ isLoading: false });

      return response.data.chatList;
    } catch (error) {
      handleError(error);
      set({ isLoading: false });
      return [];
    }
  },
  getChatInfo: async (chatId: string) => {
    try {
      set({ isLoading: true });

      const response = checkStatus(await getChatInfoApi({ chatId }));

      set({ currentChatInfo: response.data.chatInfo });
      set({ isLoading: false });

      return response.data.chatInfo;
    } catch (error) {
      handleError(error);
      set({ isLoading: false });
      return {
        chatId: "",
        chatName: "",
        messages: [],
      };
    }
  },
  setCurrentTab: (currentTab: TabEnum) => {
    set({ currentTab });
  },
  getUserInfo: async () => {
    try {
      const response = checkStatus(await getUserInfoApi());

      set({ userInfo: response.data.userInfo });
      return response.data.userInfo;
    } catch (error) {
      handleError(error);
      return {
        username: "",
        email: "",
        avatar: DefaultUserAvatar,
      };
    }
  },
}));
