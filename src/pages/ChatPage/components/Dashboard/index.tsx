import React from "react";
import cx from "classnames";
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";

import * as styles from "./style.scss";
import { useChatPageStore } from "../../../../zustand/apis/ChatPage";
import { TabEnum } from "../../../../apis/enums";
import { usePersonaStore } from "../../../../zustand/apis/Persona";

interface DashboardProps {
  setSelectedChatId: (chatId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setSelectedChatId }) => {
  // For available chats
  const { personaList, getPersonaList } = usePersonaStore();
  const { userInfo, setCurrentTab, currentTab, createChat, getChatList } =
    useChatPageStore();
  const [userRole, setUserRole] = React.useState<string>("");

  const [searchValue, setSearchValue] = React.useState("");
  const [filteredChats, setFilteredChats] = React.useState(personaList);

  const [visibleChatsCount, setVisibleChatsCount] = React.useState(5);

  React.useEffect(() => {
    getPersonaList();
  }, []);

  React.useEffect(() => {
    if (filteredChats !== personaList && personaList.length > 0) {
      setFilteredChats(personaList);
    }
  }, [personaList]);

  React.useEffect(() => {
    if (userInfo) {
      setUserRole(userInfo.role);
    }
  }, [userInfo]);

  const selectAvailableChat = async (personaId: string) => {
    const userId = userInfo.id;
    const response = await createChat(userId, personaId);
    if (currentTab === TabEnum.Dashboard) {
      setCurrentTab(TabEnum.Chat);
    }
    await getChatList();
    setSelectedChatId(response.chatId);
  };

  const handleAvailableChatSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    resetVisibleChats();
    setSearchValue(event.target.value);
    const filteredChats = personaList.filter(
      (chat) =>
        chat.personaName
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        chat.personaDescription
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
    );
    setFilteredChats(filteredChats);
  };

  const handleSeeMore = () => {
    setVisibleChatsCount(visibleChatsCount + 5);
  };

  const resetVisibleChats = () => {
    setVisibleChatsCount(5);
  };

  // For new GPT
  const [isNewGPTModalOpen, setIsNewGPTModalOpen] = React.useState(false);

  const handleNewGPTClick = () => {
    setIsNewGPTModalOpen(true);
  };

  const handleNewGPTClose = () => {
    setIsNewGPTModalOpen(false);
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Available Chats */}
      <div className={styles.dashboardCardContainer}>
        <Typography variant="h5">Available Chats</Typography>
        <Typography variant="body1">Search by courses!</Typography>

        <TextField
          placeholder="Search"
          onChange={handleAvailableChatSearch}
          value={searchValue}
        />

        <List>
          {filteredChats
            .slice(0, Math.min(filteredChats.length, visibleChatsCount))
            .map((chat) => (
              <ListItem
                className={styles.availableChatsListItem}
                key={chat.personaId}
                onClick={() => {
                  selectAvailableChat(chat.personaId);
                }}
              >
                <ListItemAvatar>
                  <Avatar src={chat.personaAvatar ?? undefined} />
                </ListItemAvatar>
                <ListItemText>
                  <Typography variant="body2">{chat.personaName}</Typography>
                  <Typography variant="subtitle1">
                    {chat.personaDescription}
                  </Typography>
                  <Typography variant="caption">
                    Last Updated:{" "}
                    {new Date(chat.updatedAt).toLocaleString("en-SG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </Typography>
                </ListItemText>
              </ListItem>
            ))}
        </List>
        <div className={cx(styles.buttonContainer, styles.center)}>
          <Button
            onClick={handleSeeMore}
            disabled={filteredChats.length < visibleChatsCount}
          >
            See more
          </Button>
        </div>
      </div>
    </div>
  );
};
