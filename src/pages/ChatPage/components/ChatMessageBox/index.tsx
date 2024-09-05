import React, { ReactElement } from "react";
import cx from "classnames";

import { UserTypeEnum } from "../../../../apis/enums";
import { Avatar, Typography } from "@mui/material";

import * as styles from "./style.scss";

interface ChatMessageBoxProps {
  userType: UserTypeEnum;
  message: string;
  typingIndicatorAnimation?: boolean;
  typingAnimation?: boolean;
  onTypingAnimationEnd?: () => void;
}

export const ChatMessageBox: React.FC<ChatMessageBoxProps> = ({
  userType,
  message,
  typingIndicatorAnimation = false,
  typingAnimation = false,
  onTypingAnimationEnd,
}) => {
  const [displayedText, setDisplayedText] = React.useState("");

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
  }, []);

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
      >
        <Typography
          variant="body1"
          className={cx({
            [styles.typingIndicator]: typingIndicatorAnimation,
          })}
        >
          {displayedText}
        </Typography>
      </div>
    </div>
  );
};
