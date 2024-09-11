import React from "react";

import { useDashboardStore } from "../../../../zustand/apis/Dashboard";
import { Grid2 } from "@mui/material";
import * as styles from "./style.scss";

export const Dashboard: React.FC = () => {
  const { availableChats, getAvailableChats } = useDashboardStore();

  React.useEffect(() => {
    getAvailableChats();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <div>
        <span>Explore Available Chats</span>
        <Grid2 container spacing={2}>
          {availableChats.map((chat) => (
            <div key={chat.chatId}>
              <div>{chat.chatName}</div>
            </div>
          ))}
        </Grid2>
      </div>
      <div>Create you own!</div>
    </div>
  );
};
