import React from "react";
import {
  Box,
  FilledInput,
  IconButton,
  InputAdornment,
  ListItem,
  Stack,
  Tooltip,
} from "@mui/material";

import { useChatPageStore } from "../../../../zustand/apis/ChatPage";
import { ChatUserTypeEnum } from "../../../../apis/enums";
import { UserChatMessageModel } from "../../../../apis/ChatPage/typings";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import HearingIcon from "@mui/icons-material/Hearing";
import SettingsVoiceIcon from "@mui/icons-material/SettingsVoice";
import { ImageChip } from "../../../../components/ImageChip";
import { FileChip } from "../../../../components/FileChip";
import cx from "classnames";

import * as chatStyles from "../ChatArea/style.scss";
import * as styles from "./style.scss";
import { urlToFile } from "../../../../utils";
import { useSpeechTranscript } from "../../../../context/SpeechTranscriptContext";

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
    File[]
  >([]);
  const [attachedFilesComponent, setAttachedFilesComponent] = React.useState<
    File[]
  >([]);

  const [isSTTActive, setIsSTTActive] = React.useState(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const [originalInputValue, setOriginalInputValue] = React.useState("");

  const { postQueryMessage, postSTTAudio } = useChatPageStore.getState();

  const [transcript, setTranscript] = React.useState("");
  const resetTranscript = () => setTranscript("");
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const [isTranscripting, setIsTranscripting] = React.useState(false);

  // On initial render, reset mediaRecorderRef
  React.useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stop();
    };
  }, []);

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
            type: "image",
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

  // Handle microphone button press
  const handleMicrophonePress = async () => {
    // If STT is active, stop listening
    if (isSTTActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current?.stop();
        mediaRecorderRef.current?.stream
          .getTracks()
          .forEach((track) => track.stop());
        setIsTranscripting(true);
      }
      setIsSTTActive(false);
      return;
    }

    // If STT is not active, start listening
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Destroy previous mediaRecorder instance if it exists
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
        audioBitsPerSecond: 16000,
      });

      mediaRecorderRef.current = mediaRecorder;

      // Should be available every start timeslice and when stop is called
      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          setIsTranscripting(true);

          const blob = new Blob([event.data], {
            type: "audio/webm;codecs=opus",
          });

          const sttResult = await postSTTAudio(blob); // Send audio chunk

          if (!sttResult || sttResult.trim() === "") return;

          setTranscript((prev) =>
            (prev.trim() + " " + sttResult.trim()).trim()
          );

          setIsTranscripting(false);
        }
      };

      // Manually request finalized chunks every 3s
      intervalRef.current = setInterval(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
          mediaRecorder.start();
        }
      }, 3000);

      mediaRecorder.start();

      setIsSTTActive(true);
    } catch (error) {
      setIsTranscripting(false);
      console.error("Error accessing microphone:", error);
    }
  };

  // TODO: Check logic for next 2 useEffects
  React.useEffect(() => {
    if (isSTTActive) {
      setOriginalInputValue(inputValue);
    } else if (!isSTTActive && !isTranscripting) {
      setInputValue((originalInputValue.trim() + " " + transcript).trim());
      setOriginalInputValue("");
      resetTranscript();
    }
  }, [isSTTActive, isTranscripting]);

  React.useEffect(() => {
    if (transcript && isSTTActive) {
      setInputValue(originalInputValue.trim() + " " + transcript);
    }
  }, [transcript, originalInputValue]);

  // Handle file attachment (if image, move it to pastedImages)
  const handleFileAttachment = (files: FileList) => {
    const filesArray = Array.from(files); // Convert FileList to array

    // Separate image files and non-image files
    const imageFiles = filesArray.filter((file) =>
      file.type.startsWith("image/")
    );
    const nonImageFiles = filesArray.filter(
      (file) => !file.type.startsWith("image/")
    );

    // Filter out duplicates for images
    const uniqueImageFiles = imageFiles.filter((file) =>
      pastedImages.every((image) => image.name !== file.name)
    );

    // Generate local URLs for images and add to pastedImages
    const imageUrls = uniqueImageFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setPastedImages((prev) => [...prev, ...imageUrls]);

    // Filter out duplicates for non-image files
    const uniqueNonImageFiles = nonImageFiles.filter((file) =>
      attachedFiles.every((attachedFile) => attachedFile.name !== file.name)
    );

    // Generate local URLs for non-image files and add to attachedFiles
    const fileUrls = uniqueNonImageFiles.map((file) => ({
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
      const files = await Promise.all(
        pastedImages.map((image) => urlToFile(image.url, image.name))
      );
      setPastedImagesComponent(files);
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
          <Stack gap={1} direction={"row"}>
            <InputAdornment position="end" disablePointerEvents={disabled}>
              <Tooltip
                title={isSTTActive ? "Stop listening" : "Start listening"}
              >
                <IconButton onMouseDown={handleMicrophonePress}>
                  {isSTTActive ? <HearingIcon /> : <SettingsVoiceIcon />}
                </IconButton>
              </Tooltip>
            </InputAdornment>
            <InputAdornment
              position="end"
              disablePointerEvents={disabled || inputValue === ""}
            >
              <IconButton onMouseDown={handleInputSubmit}>
                <ArrowUpward />
              </IconButton>
            </InputAdornment>
          </Stack>
        }
      />
    </>
  );
};
