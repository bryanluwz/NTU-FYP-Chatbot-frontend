import { createStore, create } from "zustand";
import { checkStatus, handleError } from "../../../apis/utils";
import { postQueryMessageApi } from "../../../apis/ChatPage";
import { ChatMessageModel } from "../../../apis/ChatPage/typings";

interface ChatPageState {
  messages: ChatMessageModel[];
  setMessages: (messages: ChatMessageModel[]) => void;
  appendMessage: (message: ChatMessageModel) => void;
  replaceLastMessage: (message: ChatMessageModel) => void;
  postQueryMessage: (message: string) => Promise<string>;
}

const initialStates = {
  messages: [],
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
  postQueryMessage: async (message: string) => {
    try {
      // This is the response from the API, right now not functional
      // const response = checkStatus(await postQueryMessageApi({ message }));
      // const responseMessage = response.message;
      const fakeResponseList = [
        "I'm sorry, I don't understand.",
        "If only I could understand you.",
        "明月几时有，把酒问青天。不知天上宫阙，今夕是何年。我欲乘风过去，惟恐琼楼玉宇。高处不胜寒，起舞弄清影，何似在人间。",
        "对不起，我不明白。",
        "申し訳ございません、英語は全然わかりません。",
        "これは超長いの返事みたいね、ここで私と一緒に待ってね？いやなの？( ,,`･ω･´)ﾝﾝﾝ？",
        `Somebody once told me the world is gonna roll me,
I ain't the sharpest tool in the shed,
She was looking kind of dumb with her finger and her thumb,
In the shape of an "L" on her forehead`,
      ];

      const responseMessage =
        fakeResponseList[Math.floor(Math.random() * fakeResponseList.length)];

      // Simulate a delay using a Promise
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return responseMessage;
    } catch (error) {
      handleError(error);
      return "";
    }
  },
}));
