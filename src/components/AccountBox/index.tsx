import React from "react";

import { Avatar, Typography } from "@mui/material";

import * as styles from "./style.scss";

interface AccountBoxProps {
  username?: string;
}

export const AccountBox: React.FC<AccountBoxProps> = ({
  username = "Lyon the Lion",
}) => {
  return (
    <div className={styles.avatarContainer}>
      <Avatar />
      <Typography variant="h6">Hello there, {username}!</Typography>
    </div>
  );
};
