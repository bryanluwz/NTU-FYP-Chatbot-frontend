import React from "react";
import cx from "classnames";

import { ListItemIcon, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import * as styles from "../style.scss";

interface ChatListItemProps {
  title: string;
  id: string;
  onDelete?: () => void;
  isActive?: boolean;
  setActiveChat?: (title: string) => void;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({
  title,
  id,
  onDelete = () => {},
  isActive = false,
  setActiveChat = () => {},
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseDown = () => {
    setActiveChat(id);
  };

  return (
    <div
      className={cx(styles.chatListItem, { [styles.active]: isActive })}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
    >
      <Typography variant="body1">{title}</Typography>
      <ListItemIcon>
        <DeleteIcon
          onClick={onDelete}
          style={{ visibility: isHovered || isActive ? "visible" : "hidden" }}
        />
      </ListItemIcon>
    </div>
  );
};
