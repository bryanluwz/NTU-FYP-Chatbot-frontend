import "regenerator-runtime/runtime";
import React, { createContext, useContext } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

interface SpeechTranscriptContextProps {
  transcript: string;
  resetTranscript: () => void;
  startListening: () => void;
  stopListening: () => void;
  isListening: boolean;
}

const SpeechTranscriptContext = createContext<
  SpeechTranscriptContextProps | undefined
>(undefined);

export const SpeechTranscriptProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const {
    transcript,
    resetTranscript,
    listening: isListening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });
  const stopListening = () => SpeechRecognition.stopListening();

  React.useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.error("Browser does not support speech recognition");
    }
  }, [browserSupportsSpeechRecognition]);

  return (
    <SpeechTranscriptContext.Provider
      value={{
        transcript,
        resetTranscript,
        startListening,
        stopListening,
        isListening,
      }}
    >
      {children}
    </SpeechTranscriptContext.Provider>
  );
};

export const useSpeechTranscript = () => {
  const context = useContext(SpeechTranscriptContext);
  if (!context) {
    throw new Error("useSpeech must be used within a SpeechProvider");
  }
  return context;
};
