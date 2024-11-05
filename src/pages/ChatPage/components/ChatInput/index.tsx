import React from "react";
import {
  Box,
  FilledInput,
  IconButton,
  InputAdornment,
  ListItem,
  Stack,
} from "@mui/material";

import { useChatPageStore } from "../../../../zustand/apis/ChatPage";
import { ChatUserTypeEnum } from "../../../../apis/enums";
import { UserChatMessageModel } from "../../../../apis/ChatPage/typings";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import { ImageChip } from "../../../../components/ImageChip";
import { FileChip } from "../../../../components/FileChip";
import cx from "classnames";

import * as chatStyles from "../ChatArea/style.scss";
import * as styles from "./style.scss";

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
  const [pastedImages, setPastedImages] = React.useState<
    { blob: Blob; base64: string }[]
  >([]);
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
    // Create the user message model
    const userMessageModel: UserChatMessageModel = {
      messageId: Date.now().toString(),
      userType: ChatUserTypeEnum.User,
      message: {
        text: inputValue.trim(),
        files: [...pastedImages.map((image) => image.blob), ...attachedFiles],
      },
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
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target?.result as string;

            // Check if the image (base64) is already in the pastedImages array
            if (pastedImages.some((image) => image.base64 === base64)) {
              return; // Duplicate detected, do not add
            }

            // Store the base64 data instead of the file for uniqueness check
            setPastedImages((prev) => [...prev, { blob: file, base64 }]);
          };
          reader.readAsDataURL(file); // Convert image to base64
        }
      }
    }
  };

  const attachedComponent = React.useMemo(() => {
    return (
      <Stack gap={2} className={styles.attachedStack}>
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
              blob={image.blob}
              onDelete={() => {
                setPastedImages((prevImages) =>
                  prevImages.filter((_, i) => i !== index)
                );
              }}
            />
          </ListItem>
        ))}
      </Stack>
    );
  }, [attachedFiles, pastedImages]);

  return (
    <>
      {attachedFiles.length + pastedImages.length > 0 && (
        <Box className={cx(chatStyles.chatInput, styles.attachedContainer)}>
          {attachedComponent}
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
