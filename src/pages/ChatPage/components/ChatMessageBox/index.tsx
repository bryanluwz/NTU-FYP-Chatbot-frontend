import React from "react";
import cx from "classnames";

import { ChatUserTypeEnum } from "../../../../apis/enums";
import { Avatar, ButtonGroup, IconButton, Typography } from "@mui/material";
import { ContentCopy, ContentPaste, VolumeUp } from "@mui/icons-material";

import { MuiMarkdown, getOverrides } from "mui-markdown";
import DefaultAIAvatar from "../../../../assets/ai-avatar-default.png";

import * as styles from "./style.scss";
import { useChatPageStore } from "../../../../zustand/apis/ChatPage";
import { usePersonaStore } from "../../../../zustand/apis/Persona";

interface ChatMessageBoxProps {
  userType: ChatUserTypeEnum;
  message: string;

  typingIndicatorAnimation?: boolean; // Show the bot is responding in progress
  typingAnimation?: boolean; // Show the message is being typed out
  onTypingAnimationEnd?: () => void;

  isToolboxVisible?: boolean;
  isToolboxVisibleOnHover?: boolean;
}

export const ChatMessageBox: React.FC<ChatMessageBoxProps> = ({
  userType,
  message,
  typingIndicatorAnimation = false,
  typingAnimation = false,
  onTypingAnimationEnd,
  isToolboxVisible,
  isToolboxVisibleOnHover = true,
}) => {
  const [displayedText, setDisplayedText] = React.useState("");
  const [isMenuVisible, setIsMenuVisible] = React.useState(false);
  const [hoverDebounceId, setHoverDebounceId] =
    React.useState<NodeJS.Timeout>();
  const { userInfo } = useChatPageStore();
  const { currentPersona } = usePersonaStore();

  React.useEffect(() => {
    if (typingAnimation) {
      let i = 0;

      const maxInterval = Math.max(Math.ceil(message.length / 20), 1);

      const interval = setInterval(() => {
        i += maxInterval;
        setDisplayedText(message.slice(0, i));
        if (i >= message.length) {
          clearInterval(interval);
          if (onTypingAnimationEnd) {
            onTypingAnimationEnd();
          }
        }
      }, 50);
    } else {
      setDisplayedText(message);
    }
  }, [message, onTypingAnimationEnd, typingAnimation]);

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
      <div
        className={cx(styles.messageBox, {
          [styles.user]: userType === ChatUserTypeEnum.User,
          [styles.nonUser]:
            userType !== ChatUserTypeEnum.User && !typingIndicatorAnimation,
          [styles.nonColor]:
            userType !== ChatUserTypeEnum.User && typingIndicatorAnimation,
        })}
        onMouseOver={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {typingIndicatorAnimation ? (
          <Typography
            variant="body1"
            className={cx({
              [styles.typingIndicator]: typingIndicatorAnimation,
            })}
          >
            {displayedText}
          </Typography>
        ) : (
          <MuiMarkdown overrides={{ ...getOverrides() }}>
            {displayedText}
          </MuiMarkdown>
        )}
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
              <IconButton onClick={() => console.log("Copy")}>
                <ContentCopy />
              </IconButton>
              <IconButton onClick={() => console.log("Paste")}>
                <ContentPaste />
              </IconButton>
              <IconButton onClick={() => console.log("Speak")}>
                <VolumeUp />
              </IconButton>
            </ButtonGroup>
          </div>
        )}
      </div>
    </div>
  );
};
