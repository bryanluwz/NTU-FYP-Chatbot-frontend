import { HTTPMethod } from "../typings";
import { authUserUrl, loginUrl, registerUrl } from "../urls";
import { LoginUserResponseModel, RegisterUserResponseModel } from "./typings";

export const loginApi = async (data: any) => {
  return (
    await fetch(loginUrl, {
      method: HTTPMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  ).json() as unknown as LoginUserResponseModel;
};

export const registerUserApi = async (data: any) => {
  return (
    await fetch(registerUrl, {
      method: HTTPMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  ).json() as unknown as RegisterUserResponseModel;
};

export const authUserApi = async (token: string) => {
  return (
    await fetch(authUserUrl, {
      method: HTTPMethod.POST,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).json() as unknown as LoginUserResponseModel;
};
