import React from "react";

import {
  Avatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import * as styles from "./style.scss";

import DefaultAvatar from "../../assets/chonk.png";

interface AccountBoxProps {
  username?: string;
  userAvatar?: string;
}

export const AccountBox: React.FC<AccountBoxProps> = ({
  username = "Lyon the Lion",
  userAvatar = DefaultAvatar,
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    if (event.currentTarget === null) {
      setIsMenuOpen(false);
    } else {
      setIsMenuOpen(true);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
  };

  return (
    <div className={styles.accountContainer}>
      <Menu open={isMenuOpen} onClose={handleClose} anchorEl={anchorEl}>
        <MenuItem>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText>Dashboard</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <DeleteForeverIcon />
          </ListItemIcon>
          <ListItemText>Delete All Chats</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      <div className={styles.avatarContainer} onClick={handleAvatarClick}>
        <Avatar src={userAvatar} />
      </div>
      <Typography variant="h6">Hi, {username}!</Typography>
    </div>
  );
};
