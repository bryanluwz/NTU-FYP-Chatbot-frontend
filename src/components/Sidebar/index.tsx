import React from "react";

import { Button, Drawer, List, ListItem } from "@mui/material";
import { AccountBox } from "../AccountBox";
import { ChatList } from "../ChatList";

import * as styles from "./style.scss";

interface SidebarProps {}

export const Sidebar: React.FC<SidebarProps> = ({}) => {
  const [open, setOpen] = React.useState(true);

  const handleSidebarOpen = () => {
    setOpen(true);
  };

  const handleSidebarClose = () => {
    setOpen(false);
  };

  return (
    <div className={styles.sidebarContainer}>
      <AccountBox />
      <ChatList chatList={[{ title: "bruh" }, { title: "bruh2" }]} />
      <Button onClick={() => {}}>New Chat</Button>
    </div>
  );
};
