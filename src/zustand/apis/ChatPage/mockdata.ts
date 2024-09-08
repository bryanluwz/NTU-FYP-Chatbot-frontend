import {
  ChatListModel,
  GetChatInfoResponseModel,
  GetChatListResponseModel,
  PostQueryMessageResponseModel,
} from "../../../apis/ChatPage/typings";
import { UserTypeEnum } from "../../../apis/enums";

export const postQueryMessageMockData =
  async (): Promise<PostQueryMessageResponseModel> => {
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
    return {
      status: {
        code: 200,
        message: "OK",
      },
      data: {
        message: responseMessage,
      },
    };
  };

export const getChatListMockData: GetChatListResponseModel = {
  status: {
    code: 200,
    message: "OK",
  },
  data: {
    chatList: [
      {
        chatId: "1",
        chatName: "Chat 1",
      },
      {
        chatId: "2",
        chatName: "Chat 2",
      },
      {
        chatId: "3",
        chatName: "Chat 3",
      },
    ],
  },
};

export const getChatInfoMockData = async (
  chatId: string
): Promise<GetChatInfoResponseModel> => {
  const fakeResponseList = [
    [
      {
        messageId: "1",
        userType: UserTypeEnum.User,
        message: "Hello",
      },
      {
        messageId: "2",
        userType: UserTypeEnum.AI,
        message: "Hi",
      },
    ],
    [
      {
        messageId: "1",
        userType: UserTypeEnum.User,
        message: "你好",
      },
      {
        messageId: "2",
        userType: UserTypeEnum.AI,
        message: "你好",
      },
    ],
    [
      {
        messageId: "1",
        userType: UserTypeEnum.User,
        message: "こんにちは",
      },
      {
        messageId: "2",
        userType: UserTypeEnum.AI,
        message: "こんにちは",
      },
    ],
  ];

  const messages =
    fakeResponseList[(parseInt(chatId) - 1) % fakeResponseList.length];

  return {
    status: {
      code: 200,
      message: "OK",
    },
    data: {
      chatInfo: {
        chatId,
        chatName: `Chat ${chatId}`,
        messages,
      },
    },
  };
};
