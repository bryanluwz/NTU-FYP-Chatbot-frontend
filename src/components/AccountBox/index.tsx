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
import LockIcon from "@mui/icons-material/Lock";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { useChatPageStore } from "../../zustand/apis/ChatPage";
import { TabEnum, UserRoleEnum } from "../../apis/enums";

import * as styles from "./style.scss";
import { AuthContext } from "../../context/AuthContext";
import { ConfirmModal } from "../ConfirmModal";
import { EditUserDialog } from "../EditUserDialog";
import { useDashboardStore } from "../../zustand/apis/Dashboard";
import { UpdatePasswordDialog } from "../UpdatePasswordModal";

interface AccountBoxProps {
  username?: string;
  userAvatar?: string;
}

export const AccountBox: React.FC<AccountBoxProps> = ({
  username = "Lyon the Lion",
  userAvatar,
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const {
    currentTab,
    setCurrentTab,
    deleteChat,
    getChatList,
    chatList,
    getUserInfo,
  } = useChatPageStore();

  const [isUpdateUserOpen, setIsUpdateUserOpen] = React.useState(false);
  const [isUpdatePasswordOpen, setIsUpdatePasswordOpen] = React.useState(false);

  const { logout } = React.useContext(AuthContext);

  const { userInfo } = useChatPageStore();
  const { updateUser, updatePassword } = useDashboardStore();

  const [userRole, setUserRole] = React.useState<string>("");

  React.useEffect(() => {
    if (userInfo) {
      setUserRole(userInfo.role);
    }
  }, [userInfo]);

  // Menu
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

  // Update User
  const handleUpdateUserOpen = () => {
    setIsMenuOpen(false);
    setIsUpdateUserOpen(true);
  };

  const handleUpdateUserClose = () => {
    setIsUpdateUserOpen(false);
  };

  // Update Password
  const handleUpdatePasswordOpen = () => {
    setIsMenuOpen(false);
    setIsUpdatePasswordOpen(true);
  };

  const handleUpdatePasswordClose = () => {
    setIsUpdatePasswordOpen(false);
  };

  // Delete Chat
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

          <MenuItem onClick={handleUpdateUserOpen}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText>Update Profile</ListItemText>
          </MenuItem>

          <MenuItem onClick={handleUpdatePasswordOpen}>
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText>Change Password</ListItemText>
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
          <Avatar src={userAvatar}>{username.charAt(0)}</Avatar>
        </div>
        <Typography variant="h5">Hi, {username}!</Typography>
      </div>
      <EditUserDialog
        userInfo={userInfo}
        isOpen={isUpdateUserOpen}
        onClose={handleUpdateUserClose}
        editorRole={UserRoleEnum.User}
        onSubmit={(userInfo) => {
          updateUser(userInfo).then(() => {
            getUserInfo();
          });
          handleUpdateUserClose();
        }}
      />
      <UpdatePasswordDialog
        userInfo={userInfo}
        isOpen={isUpdatePasswordOpen}
        onClose={handleUpdatePasswordClose}
        onSubmit={async (oldPassword, newPassword) => {
          const success = await updatePassword(oldPassword, newPassword);
          if (success) {
            handleUpdatePasswordClose();
          } else {
            alert("Failed to update password! Old password might be invalid.");
          }
        }}
      />
      <ConfirmModal
        isOpen={isDeleteAllChatsOpen}
        title="Delete All Chats?"
        onConfirm={handleDeleteAllChats}
        onCancel={handleDeleteAllChatsClose}
      />
    </>
  );
};
