import React from "react";
import { AuthContext, AuthProvider } from "../context/AuthContext";
import { ChatPage } from "./ChatPage";
import { SignInPage } from "./SignInPage";

export const MainPage: React.FC = () => {
  const { auth } = React.useContext(AuthContext);

  return auth.user ? <ChatPage /> : <SignInPage />;
};
