import React from "react";

import {
  Avatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { useChatPageStore } from "../../zustand/apis/ChatPage";
import { TabEnum } from "../../apis/enums";

import DefaultAvatar from "../../assets/user-avatar-default.png";
import * as styles from "./style.scss";
import { Settings } from "../Settings";
import { AuthContext } from "../../context/AuthContext";
import { ConfirmModal } from "../ConfirmModal";

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

  const { currentTab, setCurrentTab, deleteChat, getChatList, chatList } =
    useChatPageStore();

  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  const { logout } = React.useContext(AuthContext);

  const { userInfo } = useChatPageStore();
  const [userRole, setUserRole] = React.useState<string>("");

  React.useEffect(() => {
    if (userInfo) {
      setUserRole(userInfo.role);
    }
  }, [userInfo]);

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

  const handleSettingsOpen = () => {
    setIsMenuOpen(false);
    setIsSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setIsSettingsOpen(false);
  };

  const [isDeleteAllChatsOpen, setIsDeleteAllChatsOpen] = React.useState(false);

  const handleDeleteAllChatsOpen = () => {
    if (chatList.length === 0) {
      return;
    }
    setIsDeleteAllChatsOpen(true);
  };

  const handleDeleteAllChatsClose = () => {
    setIsDeleteAllChatsOpen;
  };

  const handleDeleteAllChats = async () => {
    chatList.forEach(async (chat) => {
      await deleteChat(chat.chatId);
    });
    setIsDeleteAllChatsOpen(false);
    handleClose();
    await getChatList();
    return true;
  };

  return (
    <>
      <div className={styles.accountContainer}>
        <Menu open={isMenuOpen} onClose={handleClose} anchorEl={anchorEl}>
          <MenuItem
            selected={currentTab === TabEnum.Dashboard}
            onClick={() => {
              if (currentTab !== TabEnum.Dashboard) {
                setCurrentTab(TabEnum.Dashboard);
                setIsMenuOpen(false);
              }
            }}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText>Dashboard</ListItemText>
          </MenuItem>
          {userRole === "admin" && (
            <MenuItem
              selected={currentTab === TabEnum.Admin}
              onClick={() => {
                if (currentTab !== TabEnum.Admin) {
                  setCurrentTab(TabEnum.Admin);
                  setIsMenuOpen(false);
                }
              }}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText>Admin Dashboard</ListItemText>
            </MenuItem>
          )}
          <MenuItem onClick={handleSettingsOpen}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={handleDeleteAllChatsOpen}
            disabled={chatList.length === 0}
          >
            <ListItemIcon>
              <DeleteForeverIcon />
            </ListItemIcon>
            <ListItemText>Delete All Chats</ListItemText>
          </MenuItem>
          <MenuItem onClick={logout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>

        <div className={styles.avatarContainer} onClick={handleAvatarClick}>
          <Avatar src={userAvatar} />
        </div>
        <Typography variant="h5">Hi, {username}!</Typography>
      </div>

      {isSettingsOpen && (
        <Modal open={isSettingsOpen} onClose={handleSettingsClose}>
          <Settings />
        </Modal>
      )}

      <ConfirmModal
        isOpen={isDeleteAllChatsOpen}
        title="Delete All Chats?"
        onConfirm={handleDeleteAllChats}
        onCancel={handleDeleteAllChatsClose}
      />
    </>
  );
};
