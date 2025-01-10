import React from "react";
import cx from "classnames";

import { ChatUserTypeEnum } from "../../../../apis/enums";
import {
  Avatar,
  ButtonGroup,
  IconButton,
  Typography,
  Tooltip,
  ListItem,
} from "@mui/material";
import { ContentCopy, VolumeUp, Stop } from "@mui/icons-material";

import DefaultAIAvatar from "../../../../assets/ai-avatar-default.png";

import * as styles from "./style.scss";
import { useChatPageStore } from "../../../../zustand/apis/ChatPage";
import { usePersonaStore } from "../../../../zustand/apis/Persona";
import { MarkdownRenderer } from "../../../../components/MarkdownRenderer";
import {
  ChatMessageModel,
  UserChatMessageModel,
} from "../../../../apis/ChatPage/typings";
import { FileChip } from "../../../../components/FileChip";
import { ImageChip } from "../../../../components/ImageChip";
import { useSpeechSynthesis } from "../../../../context/SpeechSynthesisContext";

interface ChatMessageBoxProps {
  userType: ChatUserTypeEnum;
  message: ChatMessageModel | UserChatMessageModel;

  typingIndicatorAnimation?: boolean; // Show the bot is responding in progress
  typingAnimation?: boolean; // Show the message is being typed out
  onTypingAnimationEnd?: () => void;

  isToolboxVisible?: boolean;
  isToolboxVisibleOnHover?: boolean;
}

export const ChatMessageBox: React.FC<ChatMessageBoxProps> = ({
  userType,
  message: messageModel,
  typingIndicatorAnimation = false,
  typingAnimation = false,
  onTypingAnimationEnd,
  isToolboxVisible,
  isToolboxVisibleOnHover = true,
}) => {
  const [message, setMessage] = React.useState<
    | string
    | { text: string; files: { url: string; type: string; name?: string }[] }
  >("");
  const [messageText, setMessageText] = React.useState("");

  const [displayedText, setDisplayedText] = React.useState("");
  const [isMenuVisible, setIsMenuVisible] = React.useState(false);
  const [hoverDebounceId, setHoverDebounceId] =
    React.useState<NodeJS.Timeout>();
  const { userInfo } = useChatPageStore();
  const { currentPersona } = usePersonaStore();

  const [isCopied, setIsCopied] = React.useState(false);

  // TODO: cannot press another message speak aloud button to stop the current speaking message and start the new one
  // currently all messages share the same speaking state
  // Should fix or not?
  const {
    isSpeakingAloud,
    setIsSpeakingAloud,
    isCurrentSpeaking,
    setIsCurrentSpeaking,
  } = useSpeechSynthesis();
  // const [isSpeakingAloud, setIsSpeakingAloud] = React.useState(false);
  // const [isCurrentSpeaking, setIsCurrentSpeaking] = React.useState(false);

  React.useEffect(() => {
    if (messageModel) {
      const _message = messageModel.message;
      setMessage(_message);
    }
  }, [messageModel]);

  React.useEffect(() => {
    let jsonMessage;
    try {
      jsonMessage = JSON.parse(message as string);
    } catch {
      jsonMessage = message;
    }
    if (typeof jsonMessage === "string") {
      setMessageText(jsonMessage as string);
    } else if (
      jsonMessage instanceof Object &&
      ("text" in jsonMessage || "files" in jsonMessage)
    ) {
      setMessageText(jsonMessage.text as string);
    }
  }, [message]);

  // Handle copy
  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      // Check if messageModel.message is JSON deserialisable
      let isJson = false;
      let parsed = null;
      try {
        parsed = JSON.parse(messageModel.message as string);
        isJson = true;
      } catch {
        isJson = false;
      }

      if (!isJson && typeof messageModel.message === "string") {
        navigator.clipboard.writeText(messageModel.message as string);
      } else if (
        isJson &&
        parsed &&
        typeof parsed === "object" &&
        "text" in parsed &&
        "files" in parsed
      ) {
        navigator.clipboard.writeText(parsed.text as string);
      }
    } else {
      console.error(
        "Clipboard API not supported or running in insecure context."
      );
    }

    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  // Handle speak aloud
  const handleSpeakAloud = () => {
    if (isSpeakingAloud) {
      window.speechSynthesis.cancel();
      setIsSpeakingAloud(false);
      setIsCurrentSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(messageText);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);

      setIsSpeakingAloud(true);
      setIsCurrentSpeaking(true);
    }
  };

  React.useEffect(() => {
    if (typingAnimation) {
      let i = 0;

      const maxInterval = Math.max(Math.ceil(messageText.length / 20), 1);

      const interval = setInterval(() => {
        i += maxInterval;
        setDisplayedText(messageText.slice(0, i));
        if (i >= messageText.length) {
          clearInterval(interval);
          if (onTypingAnimationEnd) {
            onTypingAnimationEnd();
          }
        }
      }, 50);
    } else {
      setDisplayedText(messageText);
    }
  }, [messageModel, messageText, onTypingAnimationEnd, typingAnimation]);

  // Handle mouse enter or leave the chat message box or the toolbox
  const handleMouseEnter = () => {
    if (!isToolboxVisibleOnHover) {
      return;
    }

    if (hoverDebounceId) {
      clearTimeout(hoverDebounceId);
    }
    setIsMenuVisible(true);
  };

  const handleMouseLeave = () => {
    if (!isToolboxVisibleOnHover) {
      return;
    }

    if (hoverDebounceId) {
      clearTimeout(hoverDebounceId);
    }

    const id = setTimeout(() => {
      if (hoverDebounceId) {
        clearTimeout(hoverDebounceId);
      }
      setIsMenuVisible(false);
    }, 500);
    setHoverDebounceId(id);
  };

  const personaAvatar = React.useMemo(() => {
    if (currentPersona) {
      return currentPersona.personaAvatar;
    }
    return undefined;
  }, [currentPersona]);

  const messageTextComponent = React.useMemo(() => {
    if (typingIndicatorAnimation || userType === ChatUserTypeEnum.User) {
      return (
        <Typography
          variant="body1"
          className={cx({
            [styles.typingIndicator]: typingIndicatorAnimation,
          })}
        >
          {displayedText}
        </Typography>
      );
    }
    return <MarkdownRenderer text={displayedText} />;
  }, [displayedText, typingIndicatorAnimation, userType]);

  const messageFilesComponents = React.useMemo(() => {
    let attachedImagesCount = 0;
    let attachedFiles = null;

    let jsonMessage;
    try {
      jsonMessage = JSON.parse(message as string);
    } catch {
      jsonMessage = message;
    }

    if (
      jsonMessage instanceof Object &&
      "text" in jsonMessage &&
      "files" in jsonMessage
    ) {
      jsonMessage = jsonMessage as {
        text: string;
        files: { url: string; type: string; name?: string }[];
      };
      attachedFiles = (
        <>
          {jsonMessage.files.map((file, index) => {
            let chip = null;

            // Load file from backend (only images is loaded, file is a dummy file)
            // If is of mimetype image, then do ImageChip, else do fileChip
            if (file.type.startsWith("image")) {
              chip = <ImageChip blob={file.url} />;
            } else {
              chip = <FileChip file={file.url} filename={file.name} />;
            }

            return chip && <ListItem key={index}>{chip}</ListItem>;
          })}
        </>
      );
    }

    return (
      <>
        {attachedImagesCount > 0 && (
          <Typography>
            {attachedImagesCount} image{attachedImagesCount > 1 ? "s" : ""}{" "}
            attached
          </Typography>
        )}
        {attachedFiles}
      </>
    );
  }, [message]);

  return (
    <div
      className={cx(styles.messageBoxContainer, {
        [styles.user]: userType === ChatUserTypeEnum.User,
        [styles.nonUser]: userType !== ChatUserTypeEnum.User,
      })}
    >
      <Avatar
        src={
          userType === ChatUserTypeEnum.User
            ? userInfo.avatar
            : personaAvatar
            ? personaAvatar
            : DefaultAIAvatar
        }
      >
        {userType === ChatUserTypeEnum.User
          ? userInfo.username.charAt(0)
          : ":/"}
      </Avatar>
      <div className={styles.messageBox}>
        {messageFilesComponents}
        <div
          className={cx(styles.messageText, {
            [styles.user]: userType === ChatUserTypeEnum.User,
            [styles.nonUser]:
              userType !== ChatUserTypeEnum.User && !typingIndicatorAnimation,
            [styles.nonColor]:
              userType !== ChatUserTypeEnum.User && typingIndicatorAnimation,
          })}
          onMouseOver={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {messageTextComponent}
          {(isMenuVisible || isToolboxVisible) && (
            <div
              className={cx(styles.actionMenu, {
                [styles.left]: userType !== ChatUserTypeEnum.User,
                [styles.right]: userType === ChatUserTypeEnum.User,
              })}
              onMouseOver={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <ButtonGroup variant="outlined">
                <IconButton onClick={handleCopy}>
                  <Tooltip title={isCopied ? "Copied" : "Copy"}>
                    <ContentCopy />
                  </Tooltip>
                </IconButton>
                <IconButton onClick={handleSpeakAloud}>
                  <Tooltip
                    title={
                      isSpeakingAloud && isCurrentSpeaking
                        ? "Stop speaking"
                        : "Speak aloud"
                    }
                  >
                    {isSpeakingAloud && isCurrentSpeaking ? (
                      <Stop />
                    ) : (
                      <VolumeUp />
                    )}
                  </Tooltip>
                </IconButton>
              </ButtonGroup>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
