import React from "react";
import { ChatMessageBox } from "../ChatMessageBox";
import { UserTypeEnum } from "../../../../enums";
import * as styles from "./style.scss";
import {
  FilledInput,
  IconButton,
  Input,
  InputAdornment,
  TextField,
} from "@mui/material";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import AttachFileIcon from "@mui/icons-material/AttachFile";

interface ChatAreaProps {
  messages: { userType: UserTypeEnum; message: string }[];
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages }) => {
  return (
    <div className={styles.chatAreaContainer}>
      <div className={styles.chatMessageBoxContainer}>
        {messages.map((message, index) => (
          <ChatMessageBox
            key={index}
            userType={message.userType}
            message={message.message}
          />
        ))}
      </div>
      <div className={styles.chatInputContainer}>
        <FilledInput
          className={styles.chatInput}
          placeholder="Enter your question"
          multiline
          disableUnderline
          startAdornment={
            <InputAdornment className={styles.inputAdornment} position="start">
              <IconButton>
                <AttachFileIcon />
              </IconButton>
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment className={styles.inputAdornment} position="end">
              <IconButton>
                <ArrowUpward />
              </IconButton>
            </InputAdornment>
          }
        />
      </div>
    </div>
  );
};
