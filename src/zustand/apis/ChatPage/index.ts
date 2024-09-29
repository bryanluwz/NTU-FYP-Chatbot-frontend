import { create } from "zustand";
import { checkStatus, handleError } from "../../../apis/utils";
import {
  createChatApi,
  deleteChatApi,
  getChatInfoApi,
  getChatListApi,
  getUserInfoApi,
  postQueryMessageApi,
  updateChatApi,
} from "../../../apis/ChatPage";
import {
  ChatInfoModel,
  ChatListModel,
  ChatMessageModel,
  MinimumChatInfoModel,
  UserInfoModel,
} from "../../../apis/ChatPage/typings";
import { TabEnum, ChatUserTypeEnum, UserRoleEnum } from "../../../apis/enums";
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
  postQueryMessage: (
    userMessage: ChatMessageModel
  ) => Promise<ChatMessageModel>;

  getChatList: () => Promise<ChatListModel[]>;
  getChatInfo: (chatId: string) => Promise<ChatInfoModel>;
  deleteChat: (chatId: string) => Promise<void>;
  createChat: (
    userId: string,
    personaId: string
  ) => Promise<MinimumChatInfoModel>;
  updateChat: (
    updateModel: MinimumChatInfoModel
  ) => Promise<MinimumChatInfoModel>;

  setCurrentTab: (tab: TabEnum) => void;

  getUserInfo: () => Promise<UserInfoModel>;
}

const initialStates = {
  messages: [],
  chatList: [],
  currentChatInfo: {
    userId: "",
    chatId: "",
    chatName: "",
    messages: [],
    createdAt: 0,
    updatedAt: 0,
  },
  isLoading: false,
  currentTab: TabEnum.Chat,
  userInfo: {
    id: "",
    username: "",
    email: "",
    avatar: DefaultUserAvatar,
    role: UserRoleEnum.User,
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
  postQueryMessage: async (userMessage: ChatMessageModel) => {
    try {
      // Append the user message to the messages
      set((state) => ({
        messages: [...state.messages, userMessage],
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
        messages: [...state.messages, responseMessage],
      }));

      return responseMessage;
    } catch (error) {
      handleError(error);
      set({ isLoading: false });
      return {
        messageId: "",
        userType: ChatUserTypeEnum.User,
        message: "",
      };
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
        userId: "",
        chatId: "",
        chatName: "",
        messages: [],
        createdAt: 0,
        updatedAt: 0,
      };
    }
  },
  createChat: async (userId: string, personaId: string) => {
    try {
      set({ isLoading: true });

      const response = checkStatus(await createChatApi({ userId, personaId }));

      set({ isLoading: false });

      return response.data.chatInfo;
    } catch (error) {
      handleError(error);
      set({ isLoading: false });
      return {
        chatId: "",
        chatName: "",
      };
    }
  },
  updateChat: async (udpateModel: MinimumChatInfoModel) => {
    try {
      set({ isLoading: true });

      const response = checkStatus(
        await updateChatApi({ updatedChatModel: udpateModel })
      );

      set({ isLoading: false });

      return response.data.chatInfo;
    } catch (error) {
      handleError(error);
      set({ isLoading: false });
      return {
        chatId: "",
        chatName: "",
      };
    }
  },
  deleteChat: async (chatId: string) => {
    try {
      set({ isLoading: true });

      checkStatus(await deleteChatApi({ chatId }));

      set({ isLoading: false });
    } catch (error) {
      handleError(error);
      set({ isLoading: false });
      return;
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
        id: "",
        username: "",
        email: "",
        avatar: DefaultUserAvatar,
        role: UserRoleEnum.User,
      };
    }
  },
}));
