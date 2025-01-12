import React from "react";
import { AuthContext, AuthProvider } from "../context/AuthContext";
import { SpeechSynthesisProvider } from "../context/SpeechSynthesisContext";
import { SpeechTranscriptProvider } from "../context/SpeechTranscriptContext";
import { ChatPage } from "./ChatPage";
import { SignInPage } from "./SignInPage";
import { Box, CircularProgress } from "@mui/material";

export const MainPage: React.FC = () => {
  const { auth } = React.useContext(AuthContext);

  // If have token and is loading, then show loading spinner
  // If authenticate alreadt, then show ChatPage
  // Else, show SignInPage

  return (
    <>
      <SpeechTranscriptProvider>
        <SpeechSynthesisProvider>
          {auth.user ? (
            <ChatPage />
          ) : auth.token ? (
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          ) : (
            <SignInPage />
          )}
        </SpeechSynthesisProvider>
      </SpeechTranscriptProvider>
    </>
  );
};
