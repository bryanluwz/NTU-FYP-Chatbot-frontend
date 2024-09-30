import React from "react";

import * as styles from "./style.scss";
import { Typography } from "@mui/material";

export const NewGPTModal: React.FC = () => {
  return (
    <div className={styles.newModalContainer}>
      <Typography variant="h5">Create / Edit GPT</Typography>
      <Typography variant="body1">Coming soon...</Typography>
    </div>
  );
};
