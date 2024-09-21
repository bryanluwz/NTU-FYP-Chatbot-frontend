import { HTTPMethod } from "../typings";
import { getAvailableChatsUrl } from "../urls";
import { GetAvailableChatsResponseModel } from "./typings";

export const getAvailableChatsApi = async () => {
  // In the future it is best to be able to specify how many chats to get
  return (
    await fetch(getAvailableChatsUrl, {
      method: HTTPMethod.GET,
    })
  ).json() as unknown as GetAvailableChatsResponseModel;
};
