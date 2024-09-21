import React from "react";
import cx from "classnames";

import { ChatMessageBox } from "../ChatMessageBox";
import {
  CircularProgress,
  FilledInput,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import AttachFileIcon from "@mui/icons-material/AttachFile";

import { useChatPageStore } from "../../../../zustand/apis/ChatPage";
import { ChatMessageModel } from "../../../../apis/ChatPage/typings";
import { UserTypeEnum } from "../../../../apis/enums";

import * as styles from "./style.scss";

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

  const [inputValue, setInputValue] = React.useState("");
  const { postQueryMessage } = useChatPageStore.getState();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const chatContainerBottomRef = React.useRef<HTMLDivElement>(null);

  // Handle submit input
  const handleInputSubmit = () => {
    const userMessage = inputValue.trim();

    setInputValue("");
    setIsAITyping(true);
    setIsAIResponding(true);

    const userMessageModel: ChatMessageModel = {
      messageId: Date.now().toString(),
      userType: UserTypeEnum.User,
      message: userMessage,
    };

    postQueryMessage(userMessageModel)
      .then((responseMessage) => {
        const msg = responseMessage.message.trim();
        if (msg === "") {
          throw new Error("No response from AI :/ Are they sleeping?");
        }
        setIsAIResponding(false);
      })
      .catch(() => {
        setIsAITyping(false);
        setIsAIResponding(false);
      });
  };

  // On reply end
  const onReplyEnd = () => {
    // Focus on the input
    setIsAITyping(false);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 10); // Delay to prevent attempting to focus when disabled
  };

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
              message={message.message}
              typingAnimation={
                isAITyping &&
                index === messages.length - 1 &&
                message.userType === UserTypeEnum.AI
              }
              onTypingAnimationEnd={onReplyEnd}
              isToolboxVisibleOnHover={!isAIResponding}
              isToolboxVisible={
                index === messages.length - 1 &&
                message.userType !== UserTypeEnum.User
              }
            />
          );
        })}
      </>
    );
  }, [isAIResponding, isAITyping, messages]);

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
                userType={UserTypeEnum.AI}
                message=""
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
            <FilledInput
              inputRef={inputRef}
              value={inputValue}
              disabled={isAIResponding || isAITyping}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleInputSubmit();
                }
              }}
              className={styles.chatInput}
              placeholder="Enter your question"
              multiline
              disableUnderline
              startAdornment={
                <InputAdornment
                  className={styles.inputAdornment}
                  position="start"
                  disablePointerEvents={isAIResponding || isAITyping}
                >
                  <IconButton>
                    <AttachFileIcon />
                  </IconButton>
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment
                  className={styles.inputAdornment}
                  position="end"
                  disablePointerEvents={
                    isAIResponding || isAITyping || inputValue === ""
                  }
                >
                  <IconButton onMouseDown={handleInputSubmit}>
                    <ArrowUpward />
                  </IconButton>
                </InputAdornment>
              }
            />
          </div>
        </>
      )}
    </div>
  );
};
