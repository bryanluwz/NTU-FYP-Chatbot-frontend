import React from "react";
import cx from "classnames";

import { ChatUserTypeEnum } from "../../../../apis/enums";
import {
  Avatar,
  ButtonGroup,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import { ContentCopy, VolumeUp } from "@mui/icons-material";

import DefaultAIAvatar from "../../../../assets/ai-avatar-default.png";

import * as styles from "./style.scss";
import { useChatPageStore } from "../../../../zustand/apis/ChatPage";
import { usePersonaStore } from "../../../../zustand/apis/Persona";
import { MarkdownRenderer } from "../../../../components/MarkdownRenderer";

interface ChatMessageBoxProps {
  userType: ChatUserTypeEnum;
  message: string;

  typingIndicatorAnimation?: boolean; // Show the bot is responding in progress

  isToolboxVisible?: boolean;
  isToolboxVisibleOnHover?: boolean;
}

export const ChatMessageBox: React.FC<ChatMessageBoxProps> = ({
  userType,
  message,
  typingIndicatorAnimation = false,
  isToolboxVisible,
  isToolboxVisibleOnHover = true,
}) => {
  const [displayedText, setDisplayedText] = React.useState("");
  const [isMenuVisible, setIsMenuVisible] = React.useState(false);
  const [hoverDebounceId, setHoverDebounceId] =
    React.useState<NodeJS.Timeout>();
  const { userInfo } = useChatPageStore();
  const { currentPersona } = usePersonaStore();

  // Handle copy
  const [isCopied, setIsCopied] = React.useState(false);

  React.useEffect(() => {
    setDisplayedText(message);
  }, [message]);

  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(message);
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

  const messageText = React.useMemo(() => {
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
        {messageText}
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
              <IconButton
                onClick={() =>
                  console.log(
                    "Unfornunately, the developer does not have enough budget"
                  )
                }
              >
                <Tooltip title={"Not available in your region"}>
                  <VolumeUp />
                </Tooltip>
              </IconButton>
            </ButtonGroup>
          </div>
        )}
      </div>
    </div>
  );
};
