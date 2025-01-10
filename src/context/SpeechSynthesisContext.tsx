import React from "react";

const SpeechSynthesisContext = React.createContext({
  isSpeakingAloud: false,
  isCurrentSpeaking: false,
  setIsSpeakingAloud: (value: boolean) => {},
  setIsCurrentSpeaking: (value: boolean) => {},
});

interface SpeechSynthesisProviderProps {
  children: React.ReactNode;
}

export const SpeechSynthesisProvider: React.FC<
  SpeechSynthesisProviderProps
> = ({ children }) => {
  const [isSpeakingAloud, setIsSpeakingAloud] = React.useState(false);
  const [isCurrentSpeaking, setIsCurrentSpeaking] = React.useState(false);

  React.useEffect(() => {
    const handleVoicesChanged = () => {
      setIsSpeakingAloud(false);
      setIsCurrentSpeaking(false);
    };

    const handleStart = () => {
      setIsSpeakingAloud(true);
      setIsCurrentSpeaking(true);
    };

    const handleEnd = () => {
      setIsSpeakingAloud(false);
      setIsCurrentSpeaking(false);
    };

    const handleError = (event: SpeechSynthesisErrorEvent) => {
      setIsSpeakingAloud(false);
      setIsCurrentSpeaking(false);
      console.error(`Speech synthesis error: ${event.error}`);
    };

    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;

    const originalSpeak = window.speechSynthesis.speak;
    window.speechSynthesis.speak = (utterance) => {
      utterance.onstart = handleStart;
      utterance.onend = handleEnd;
      utterance.onerror = handleError;
      originalSpeak.call(window.speechSynthesis, utterance);
    };

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.speak = originalSpeak;
    };
  }, []);

  return (
    <SpeechSynthesisContext.Provider
      value={{
        isSpeakingAloud: isSpeakingAloud,
        isCurrentSpeaking: isCurrentSpeaking,
        setIsSpeakingAloud: setIsSpeakingAloud,
        setIsCurrentSpeaking: setIsCurrentSpeaking,
      }}
    >
      {children}
    </SpeechSynthesisContext.Provider>
  );
};

export const useSpeechSynthesis = () =>
  React.useContext(SpeechSynthesisContext);
