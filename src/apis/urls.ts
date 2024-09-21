const baseUrl = `http://localhost:3000`;

export const postQueryChatMessageUrl = `${baseUrl}/api/chat`;
export const getChatListUrl = `${baseUrl}/api/chat/list`;
export const getChatInfoUrl = (chatId: string) =>
  `${baseUrl}/api/chat?chatId=${chatId}`;
export const getUserInfoUrl = `${baseUrl}/api/user/info`;

export const getAvailableChatsUrl = `/api/chat/available`;
export const postChatUrl = `/api/chat/`; // Same for create, update and delete
