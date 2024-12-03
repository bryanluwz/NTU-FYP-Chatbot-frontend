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
import { urlToBlob, urlToFile } from "../../../../utils";

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
    { name: string; url: string }[]
  >([]);
  const [attachedFiles, setAttachedFiles] = React.useState<
    { name: string; url: string }[]
  >([]);

  const [pastedImagesComponent, setPastedImagesComponent] = React.useState<
    Blob[]
  >([]);
  const [attachedFilesComponent, setAttachedFilesComponent] = React.useState<
    File[]
  >([]);

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
        files: [
          ...pastedImages.map((i) => ({
            url: i.url,
            type: "blob",
            name: i.name,
          })),
          ...attachedFiles.map((i) => ({
            url: i.url,
            type: "file",
            name: i.name,
          })),
        ],
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

    // Prevent duplicate file with the same name
    const filteredFilesArray = filesArray.filter((file) =>
      attachedFiles.every((attachedFile) => attachedFile.name !== file.name)
    );

    // Generate local URLs for the filtered files
    const fileUrls = filteredFilesArray.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setAttachedFiles((prevFiles) => [...prevFiles, ...fileUrls]);
  };

  // Handle pasted image
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const clipboardItems = e.clipboardData.items;

    for (let i = 0; i < clipboardItems.length; i++) {
      const item = clipboardItems[i];

      if (item.type.includes("image")) {
        const file = item.getAsFile();

        if (file) {
          const localUrl = URL.createObjectURL(file);

          // Check if the image URL is already in the pastedImages array
          if (pastedImages.some((image) => image.url === localUrl)) {
            return; // Duplicate detected, do not add
          }

          // Store only the URL
          setPastedImages((prev) => [
            ...prev,
            { name: file.name, url: localUrl },
          ]);
        }
      }
    }
  };

  React.useEffect(() => {
    const convert = async () => {
      const blobs = await Promise.all(
        pastedImages.map((image) => urlToBlob(image.url))
      );
      setPastedImagesComponent(blobs);
    };
    convert();
  }, [pastedImages]);

  React.useEffect(() => {
    const convert = async () => {
      const files = await Promise.all(
        attachedFiles.map((file) => urlToFile(file.url, file.name))
      );
      setAttachedFilesComponent(files);
    };
    convert();
  }, [attachedFiles]);

  const attachedComponent = React.useMemo(() => {
    return (
      <Stack gap={2} className={styles.attachedStack}>
        {attachedFilesComponent.map((file, index) => (
          <ListItem key={index}>
            <FileChip
              file={file}
              onDelete={() => {
                setAttachedFiles((prevFiles) =>
                  prevFiles.filter((_, i) => i !== index)
                );
              }}
            />
          </ListItem>
        ))}
        {pastedImagesComponent.map((image, index) => (
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
    );
  }, [attachedFilesComponent, pastedImagesComponent]);

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
