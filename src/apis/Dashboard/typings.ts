import { UserInfoModel } from "../ChatPage/typings";
import { HTTPStatusBody } from "../typings";

export interface GetUserListResponseModel {
  status: HTTPStatusBody;
  data: {
    users: UserInfoModel[];
  };
}

export interface UpdateUserResponseModel {
  status: HTTPStatusBody;
  data: {};
}

export interface DeleteUserResponseModel {
  status: HTTPStatusBody;
  data: {};
}
