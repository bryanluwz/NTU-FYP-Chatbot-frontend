const baseUrl = ""; // for dev use "http://localhost:3000" or whatever the port is, for prod use ""
// const baseUrl = "https://localhost:3000"; // for dev use "http://localhost:3000" or whatever the port is, for prod use ""

export const postQueryChatMessageUrl = `${baseUrl}/api/chat/message`;
export const getChatListUrl = `${baseUrl}/api/chat/list`;
export const updateChatMessageUrl = `${baseUrl}/api/chat`;

export const getUserInfoUrl = `${baseUrl}/api/user/info`;

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
export const updatePasswordUrl = `${baseUrl}/api/user/updatepw`;
export const updateUserSettingsUrl = `${baseUrl}/api/user/settings`;

// Personas
export const getPersonasUrl = `${baseUrl}/api/persona/available`;
export const updatePersonaUrl = `${baseUrl}/api/persona/update`;
export const createPersonaUrl = `${baseUrl}/api/persona/create`;
export const deletePersonaUrl = `${baseUrl}/api/persona/delete`;
export const getPersonaUrl = (chatId: string) =>
  `${baseUrl}/api/persona/${chatId}`;
