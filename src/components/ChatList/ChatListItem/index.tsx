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
  disabled?: boolean;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({
  title,
  id,
  onDelete = () => {},
  isActive = false,
  setActiveChat = () => {},
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => {
    if (disabled) {
      return;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (disabled) {
      return;
    }
    setIsHovered(false);
  };

  const handleMouseDown = () => {
    if (disabled) {
      return;
    }
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
