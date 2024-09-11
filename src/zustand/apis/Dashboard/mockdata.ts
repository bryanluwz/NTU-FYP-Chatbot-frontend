import { GetAvailableChatsResponseModel } from "../../../apis/Dashboard/typings";

export const getAvailableChatsMockData: GetAvailableChatsResponseModel = {
  status: {
    code: 200,
    message: "Success",
  },
  data: {
    availableChats: [
      {
        chatId: "1",
        chatName: "Chat 1",
        chatDescription: "Description 1",
      },
      {
        chatId: "2",
        chatName: "Chat 2",
        chatDescription: "Description 2",
      },
    ],
  },
};
