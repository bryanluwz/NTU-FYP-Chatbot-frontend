const baseUrl = `http://localhost:3000`;

export const queryChatMessageUrl = `/api/chat/message`;
export const getChatListUrl = `${baseUrl}/api/chat/list`;
export const getChatInfoUrl = (chatId: string) => `/api/chat/${chatId}`;
export const updateChatMessageUrl = `/api/chat/message`;
export const getUserInfoUrl = `${baseUrl}/api/user/info`;

export const getAvailableChatsUrl = `/api/chat/available`;
export const postChatUrl = `/api/chat/`; // Same for create, update and delete
