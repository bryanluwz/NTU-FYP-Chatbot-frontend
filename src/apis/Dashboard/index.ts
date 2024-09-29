import { HTTPMethod } from "../typings";
import { getAvailableChatsUrl } from "../urls";
import { fetchWithAuth } from "../utils";
import { GetPersonaResponseModel } from "./typings";

export const getAvailableChatsApi = async () => {
  // In the future it is best to be able to specify how many chats to get
  return (
    await fetchWithAuth(getAvailableChatsUrl, {
      method: HTTPMethod.GET,
    })
  ).json() as unknown as GetPersonaResponseModel;
};
