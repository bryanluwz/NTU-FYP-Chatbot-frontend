const baseUrl = `http://10.226.235.142:3000`; // local machine ip address

export const postQueryChatMessageUrl = `${baseUrl}/api/chat/message`;
export const getChatListUrl = `${baseUrl}/api/chat/list`;
export const updateChatMessageUrl = `${baseUrl}/api/chat`;

export const getUserInfoUrl = `${baseUrl}/api/user/info`;

export const getAvailableChatsUrl = `${baseUrl}/api/dashboard/available`;
export const getUserListUrl = `${baseUrl}/api/dashboard/admin/users`;
export const postChatUrl = `/api/chat/`; // Same for create, update and delete

// Auth
export const loginUrl = `${baseUrl}/api/auth/login`;
export const registerUrl = `${baseUrl}/api/auth/register`;
export const authUserUrl = `${baseUrl}/api/auth/user`;

// User
export const updateUserUrl = `${baseUrl}/api/user/update`;
export const deleteUserUrl = `${baseUrl}/api/user/delete`;
export const createUserUrl = `${baseUrl}/api/user/create`;
