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

interface AccountBoxProps {
  username?: string;
  userAvatar?: string;
}

export const AccountBox: React.FC<AccountBoxProps> = ({
  username = "Lyon the Lion",
  userAvatar = "../../../assets/chonk.png",
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    if (anchorEl) {
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen(false);
    }
  }, [anchorEl]);

  return (
    <div className={styles.accountContainer}>
      <Menu open={isMenuOpen} onClose={handleClose} anchorEl={anchorEl}>
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
