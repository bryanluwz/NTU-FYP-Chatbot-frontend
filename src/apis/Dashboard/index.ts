import { HTTPMethod } from "../typings";
import { getAvailableChatsUrl } from "../urls";
import { GetAvailableChatsResponseModel } from "./typings";

export const getAvailableChatsApi = async () => {
  return (await fetch(getAvailableChatsUrl, {
    method: HTTPMethod.GET,
  })) as unknown as GetAvailableChatsResponseModel;
};
