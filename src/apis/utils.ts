import { HTTPStatusBody } from "./typings";

export const checkStatus = (response: any) => {
  const { code } = response?.status as HTTPStatusBody;
  const statusCode = Number(code);
  if (statusCode >= 200 && statusCode < 300) {
    return response;
  } else {
    const error = new Error(response.statusText);
    throw error;
  }
};

export const handleError = (error: any) => {
  console.error(error);
};
