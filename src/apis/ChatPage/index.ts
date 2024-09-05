import { PostQueryMessageResponseModel } from "./typings";
import { HTTPMethod } from "../typings";
import { queryChatMessageUrl } from "../urls";

export const postQueryMessageApi = async (data: any) => {
  return (await fetch(queryChatMessageUrl, {
    method: HTTPMethod.POST,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })) as unknown as PostQueryMessageResponseModel;
};
