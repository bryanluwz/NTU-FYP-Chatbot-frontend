import React from "react";
import {
  Box,
  FilledInput,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
} from "@mui/material";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useChatPageStore } from "../../../../zustand/apis/ChatPage";
import { ChatUserTypeEnum } from "../../../../apis/enums";
import { ChatMessageModel } from "../../../../apis/ChatPage/typings";
import * as chatStyles from "../ChatArea/style.scss";
import * as styles from "./styles.scss";
import ClearIcon from "@mui/icons-material/Clear";
import { ImageChip } from "../../../../components/ImageChip";
import cx from "classnames";
import { FileChip } from "../../../../components/FileChip";

interface ChatInputProps {
  setRef: React.Dispatch<
    React.SetStateAction<React.RefObject<HTMLInputElement> | undefined>
  >;
  setIsAITyping: (_: boolean) => void;
  setIsAIResponding: (_: boolean) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  setRef,
  setIsAITyping,
  setIsAIResponding,
  disabled,
}) => {
  const [inputValue, setInputValue] = React.useState("");
  const [pastedImages, setPastedImages] = React.useState<Blob[]>([]);
  const [attachedFiles, setAttachedFiles] = React.useState<File[]>([]);

  // Handle file removal
  const handleFileRemove = (fileToRemove: File) => {
    setAttachedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileToRemove.name)
    );
  };

  const { postQueryMessage } = useChatPageStore.getState();

  // Handle input submit with text, images, and attachments
  const handleInputSubmit = () => {
    const messageContent = {
      text: inputValue.trim(),
      pastedImages,
      attachedFiles,
    };

    // Create the user message model
    const userMessageModel: ChatMessageModel = {
      messageId: Date.now().toString(),
      userType: ChatUserTypeEnum.User,
      message: JSON.stringify(messageContent), // Convert content to JSON format
    };

    // Reset input fields
    setInputValue("");
    setPastedImages([]);
    setAttachedFiles([]);
    setIsAITyping(true);
    setIsAIResponding(true);

    // Post message
    postQueryMessage(userMessageModel)
      .then((responseMessage) => {
        setIsAIResponding(false);
      })
      .catch(() => {
        setIsAITyping(false);
        setIsAIResponding(false);
      });
  };

  // Handle file attachment
  const handleFileAttachment = (files: FileList) => {
    const filesArray = Array.from(files); // Convert FileList to array

    // Prevent duplicate file with same name
    const filteredFilesArray = filesArray.filter((file) =>
      attachedFiles.every((attachedFile) => attachedFile.name !== file.name)
    );

    setAttachedFiles((prevFiles) => [...prevFiles, ...filteredFilesArray]);
  };

  // Handle pasted image
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const clipboardItems = e.clipboardData.items;
    for (let i = 0; i < clipboardItems.length; i++) {
      const item = clipboardItems[i];
      if (item.type.includes("image")) {
        const file = item.getAsFile();
        if (file) {
          // Check if the image is already in the pastedImages array
          if (pastedImages.some((image) => image.name === file.name)) {
            return;
          }

          // Instead of using FileReader to convert to base64, just use the file directly
          setPastedImages((prev) => [...prev, file]); // Store the file as a blob
        }
      }
    }
  };

  return (
    <>
      {attachedFiles.length + pastedImages.length > 0 && (
        <Box className={cx(chatStyles.chatInput, styles.attachedContainer)}>
          <Stack gap={2} sx={{ padding: "1rem" }}>
            {attachedFiles.map((file, index) => (
              <ListItem key={index}>
                <FileChip
                  file={file}
                  onDelete={() => {
                    handleFileRemove(file);
                  }}
                />
              </ListItem>
            ))}
            {pastedImages.map((image, index) => (
              <ListItem key={index}>
                <ImageChip
                  blob={image}
                  onDelete={() => {
                    setPastedImages((prevImages) =>
                      prevImages.filter((_, i) => i !== index)
                    );
                  }}
                />
              </ListItem>
            ))}
          </Stack>
        </Box>
      )}
      <FilledInput
        inputRef={setRef}
        value={inputValue}
        disabled={disabled}
        onChange={(e) => setInputValue(e.target.value)}
        onPaste={handlePaste}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleInputSubmit();
          }
        }}
        className={chatStyles.chatInput}
        placeholder="Enter your question or paste an image"
        multiline
        disableUnderline
        startAdornment={
          <InputAdornment position="start" disablePointerEvents={disabled}>
            <IconButton component="label">
              <AttachFileIcon />
              <input
                type="file"
                hidden
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    handleFileAttachment(files);
                  }
                }}
              />
            </IconButton>
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment
            position="end"
            disablePointerEvents={disabled || inputValue === ""}
          >
            <IconButton onMouseDown={handleInputSubmit}>
              <ArrowUpward />
            </IconButton>
          </InputAdornment>
        }
      />
    </>
  );
};
