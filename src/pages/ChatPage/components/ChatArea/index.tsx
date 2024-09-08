import React from "react";
import cx from "classnames";

import { ChatMessageBox } from "../ChatMessageBox";
import { FilledInput, IconButton, InputAdornment } from "@mui/material";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import AttachFileIcon from "@mui/icons-material/AttachFile";

import { useChatPageStore } from "../../../../zustand/apis/ChatPage";
import { ChatMessageModel } from "../../../../apis/ChatPage/typings";
import { UserTypeEnum } from "../../../../apis/enums";

import * as styles from "./style.scss";

interface ChatAreaProps {
  messages: ChatMessageModel[];
  appendMessage: (message: ChatMessageModel) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  appendMessage,
}) => {
  const [isAIResponding, setIsAIResponding] = React.useState(false);
  const [isAITyping, setIsAITyping] = React.useState(false);
  const [isToBottomButtonVisible, setIsToBottomButtonVisible] =
    React.useState(false);

  const [inputValue, setInputValue] = React.useState("");
  const { postQueryMessage } = useChatPageStore.getState();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const chatContainerBottomRef = React.useRef<HTMLDivElement>(null);

  // Handle submit input
  const handleInputSubmit = () => {
    const userMessage = inputValue.trim();

    setInputValue("");
    setIsAITyping(true);
    setIsAIResponding(true);

    postQueryMessage(userMessage)
      .then(() => {
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

  // Scroll observer
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsToBottomButtonVisible(!entry.isIntersecting);
      },
      { threshold: 1 }
    );

    observer.observe(chatContainerBottomRef.current!);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={styles.chatAreaContainer}>
      <div className={styles.chatMessageBoxContainer}>
        {chatMessageBoxes}
        {isAIResponding && (
          <ChatMessageBox
            userType={UserTypeEnum.AI}
            message=""
            typingIndicatorAnimation={isAIResponding}
          />
        )}
        <div ref={chatContainerBottomRef} />
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
    </div>
  );
};
