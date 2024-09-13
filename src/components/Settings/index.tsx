import React from "react";

import * as styles from "./style.scss";
import { Typography } from "@mui/material";

export const Settings: React.FC = () => {
  return (
    <div className={styles.settingsContainer}>
      <Typography variant="h5">Settings</Typography>
      <Typography variant="body1">Coming soon...</Typography>
    </div>
  );
};
