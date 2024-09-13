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
        chatName: "SC1234 - Chatbot Structures and Algorithms",
        chatDescription:
          "This is a course chatbot for SC1234, created by Gorlock the Destroyer",
        chatAvatar: "https://via.placeholder.com/150",
        createdAt: 1726117610000,
        updatedAt: 1726117610000,
      },
      {
        chatId: "2",
        chatName: "SC6969 - Chatbot Design Patterns",
        chatDescription:
          "This is a course chatbot for SC6969, haha funny number",
        chatAvatar: "https://via.placeholder.com/150",
        createdAt: 1626117610000,
        updatedAt: 1726117610000,
      },
      {
        chatId: "3",
        chatName: "SC420 - Chatbot Development",
        chatDescription:
          "This is a course chatbot for SC420, created by the legendary Snoop Dogg",
        chatAvatar: "https://via.placeholder.com/150",
        createdAt: 1526117610000,
        updatedAt: 1726117610000,
      },
      {
        chatId: "4",
        chatName: "SC1337 - Chatbot Security",
        chatDescription:
          "This is a course chatbot for SC1337, created by the infamous 4chan hacker",
        chatAvatar: "https://via.placeholder.com/150",
        createdAt: 1426117610000,
        updatedAt: 1726117610000,
      },
      {
        chatId: "5",
        chatName: "SC80085 - Chatbot Machine Learning",
        chatDescription:
          "This is a course chatbot for SC80085, created by the one and only Elon Musk",
        chatAvatar: "https://via.placeholder.com/150",
        createdAt: 1326117610000,
        updatedAt: 1726117610000,
      },
      {
        chatId: "6",
        chatName: "SC9001 - Chatbot Artificial Intelligence",
        chatDescription:
          "This is a course chatbot for SC9001, created by the AI overlord Skynet",
        chatAvatar: "https://via.placeholder.com/150",
        createdAt: 1226117610000,
        updatedAt: 1726117610000,
      },
      {
        chatId: "7",
        chatName: "SC1111 - Chatbot Ethics",
        chatDescription:
          "This is a course chatbot for SC1111, created by the ethical hacker 4chan",
        chatAvatar: "https://via.placeholder.com/150",
        createdAt: 1126117610000,
        updatedAt: 1726117610000,
      },
      {
        chatId: "8",
        chatName: "SC0000 - Chatbot Introduction",
        chatDescription:
          "This is a course chatbot for SC0000, created by the mysterious hacker 4chan",
        chatAvatar: "https://via.placeholder.com/150",
        createdAt: 1026117610000,
        updatedAt: 1726117610000,
      },
    ],
  },
};
