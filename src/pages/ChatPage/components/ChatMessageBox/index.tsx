import React from "react";
import cx from "classnames";

import { UserTypeEnum } from "../../../../enums";
import { Avatar, Typography } from "@mui/material";

import * as styles from "./style.scss";

interface ChatMessageBoxProps {
  userType: UserTypeEnum;
  message: string;
}

export const ChatMessageBox: React.FC<ChatMessageBoxProps> = ({
  userType,
  message,
}) => {
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
          [styles.nonUser]: userType !== UserTypeEnum.User,
        })}
      >
        <Typography variant="body1">{message}</Typography>
      </div>
    </div>
  );
};
