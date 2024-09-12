import React from "react";

import { useDashboardStore } from "../../../../zustand/apis/Dashboard";
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

import DefaultChatAvatar from "../../../../assets/ai-avatar-default.png";
import * as styles from "./style.scss";

export const Dashboard: React.FC = () => {
  // For available chats
  const { availableChats, getAvailableChats } = useDashboardStore();
  const [searchValue, setSearchValue] = React.useState("");
  const [filteredChats, setFilteredChats] = React.useState(availableChats);

  const [visibleChatsCount, setVisibleChatsCount] = React.useState(5);

  React.useEffect(() => {
    getAvailableChats();
  }, []);

  React.useEffect(() => {
    if (filteredChats !== availableChats && availableChats.length > 0) {
      setFilteredChats(availableChats);
    }
  }, [availableChats]);

  const selectAvailableChat = (chatId: string) => {
    console.log(chatId);
  };

  const handleAvailableChatSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    resetVisibleChats();
    setSearchValue(event.target.value);
    const filteredChats = availableChats.filter(
      (chat) =>
        chat.chatName
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        chat.chatDescription
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
  const handleNewGPTClick = () => {
    console.log("New GPT clicked");
  };

  return (
    <div className={styles.dashboardContainer}>
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
                key={chat.chatId}
                onClick={() => {
                  selectAvailableChat(chat.chatId);
                }}
              >
                <ListItemAvatar>
                  <Avatar src={chat.chatAvatar ?? DefaultChatAvatar} />
                </ListItemAvatar>
                <ListItemText>
                  <Typography variant="body1">{chat.chatName}</Typography>
                  <Typography variant="body2">
                    {chat.chatDescription}
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleSeeMore}
          disabled={filteredChats.length < visibleChatsCount}
        >
          See more
        </Button>
      </div>
      <div className={styles.dashboardCardContainer}>
        <Typography variant="h5">New GPT</Typography>
        <Typography variant="body1">Create your own GPT!</Typography>
        <Button variant="contained" color="primary" onClick={handleNewGPTClick}>
          New GPT
        </Button>
      </div>
    </div>
  );
};
