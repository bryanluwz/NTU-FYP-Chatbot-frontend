import React from "react";
import cx from "classnames";

import { UserTypeEnum } from "../../../../apis/enums";
import { Avatar, ButtonGroup, IconButton, Typography } from "@mui/material";
import { ContentCopy, ContentPaste, VolumeUp } from "@mui/icons-material";

import * as styles from "./style.scss";

interface ChatMessageBoxProps {
  userType: UserTypeEnum;
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

  return (
    <div
      className={cx(styles.messageBoxContainer, {
        [styles.user]: userType === UserTypeEnum.User,
        [styles.nonUser]: userType !== UserTypeEnum.User,
      })}
    >
      <Avatar>{userType === UserTypeEnum.User ? "U" : "A"}</Avatar>
      <div
        className={cx(styles.messageBox, {
          [styles.user]: userType === UserTypeEnum.User,
          [styles.nonUser]:
            userType !== UserTypeEnum.User && !typingIndicatorAnimation,
          [styles.nonColor]:
            userType !== UserTypeEnum.User && typingIndicatorAnimation,
        })}
        onMouseOver={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Typography
          variant="body1"
          className={cx({
            [styles.typingIndicator]: typingIndicatorAnimation,
          })}
        >
          {displayedText}
        </Typography>
        {(isMenuVisible || isToolboxVisible) && (
          <div
            className={cx(styles.actionMenu, {
              [styles.left]: userType !== UserTypeEnum.User,
              [styles.right]: userType === UserTypeEnum.User,
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
