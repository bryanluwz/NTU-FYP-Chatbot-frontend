import React from "react";
import cx from "classnames";

import { ChatMessageBox } from "../ChatMessageBox";
import { CircularProgress, IconButton, Typography } from "@mui/material";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import { ChatMessageModel } from "../../../../apis/ChatPage/typings";
import { ChatUserTypeEnum } from "../../../../apis/enums";

import * as styles from "./style.scss";
import { ChatInput } from "../ChatInput";

interface ChatAreaProps {
  isLoading: boolean;
  loadingMessage?: string;
  messages: ChatMessageModel[];
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  isLoading,
  loadingMessage,
  messages,
}) => {
  const [isAIResponding, setIsAIResponding] = React.useState(false);
  const [isAITyping, setIsAITyping] = React.useState(false);
  const [isToBottomButtonVisible, setIsToBottomButtonVisible] =
    React.useState(false);

  const [inputRef, setInputRef] =
    React.useState<React.RefObject<HTMLInputElement>>();
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const chatContainerBottomRef = React.useRef<HTMLDivElement>(null);

  // On reply end
  const onReplyEnd = React.useCallback(() => {
    // Focus on the input
    setIsAITyping(false);
    setTimeout(() => {
      if (inputRef?.current) {
        inputRef.current.focus();
      }
    }, 10); // Delay to prevent attempting to focus when disabled
  }, [inputRef]);

  // Only render the chat message box when the messages change
  const chatMessageBoxes = React.useMemo(() => {
    if (!messages || messages.length === 0) {
      return <></>;
    }
    return (
      <>
        {messages.map((message, index) => {
          return (
            <ChatMessageBox
              key={index}
              userType={message.userType}
              message={message}
              typingAnimation={
                isAITyping &&
                index === messages.length - 1 &&
                message.userType === ChatUserTypeEnum.AI
              }
              onTypingAnimationEnd={onReplyEnd}
              isToolboxVisibleOnHover={!isAIResponding}
              isToolboxVisible={
                index === messages.length - 1 &&
                message.userType !== ChatUserTypeEnum.User
              }
            />
          );
        })}
      </>
    );
  }, [isAIResponding, isAITyping, messages, onReplyEnd]);

  // Scroll to bottom when messages change
  React.useEffect(() => {
    chatContainerBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAIResponding, isAITyping]);

  React.useEffect(() => {
    if (!chatContainerBottomRef.current || !chatContainerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isChatContainerScrollable =
          (chatContainerRef.current?.scrollHeight ?? 1) >
          (chatContainerRef.current?.clientHeight ?? 0); // Don't touch this, i don't know why it works
        setIsToBottomButtonVisible(
          !entry.isIntersecting && isChatContainerScrollable
        );
      },
      {
        threshold: 1,
      }
    );

    observer.observe(chatContainerBottomRef.current!);

    return () => {
      observer.disconnect();
    };
  }, [chatContainerBottomRef.current, chatContainerRef.current]);

  return (
    <div className={styles.chatAreaContainer}>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          {
            <Typography variant="h6">
              {loadingMessage ?? "Loading..."}
            </Typography>
          }
          <CircularProgress color="primary" />
        </div>
      ) : (
        <>
          <div
            ref={chatContainerRef}
            className={styles.chatMessageBoxContainer}
          >
            {chatMessageBoxes}
            {isAIResponding && (
              <ChatMessageBox
                userType={ChatUserTypeEnum.AI}
                message={{} as ChatMessageModel}
                typingIndicatorAnimation={isAIResponding}
              />
            )}
            <div
              className={cx(styles.scrollToBottom, {
                [styles.hidden]: !isToBottomButtonVisible,
              })}
            >
              <IconButton
                onClick={() => {
                  chatContainerBottomRef.current?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                <ArrowDownward />
              </IconButton>
            </div>
            <div ref={chatContainerBottomRef} />
          </div>
          <div className={styles.chatInputContainer}>
            <ChatInput
              setRef={setInputRef}
              setIsAIResponding={setIsAIResponding}
              setIsAITyping={setIsAITyping}
              disabled={isAIResponding || isAITyping}
            />
          </div>
        </>
      )}
    </div>
  );
};
