import React from "react";

import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { UserSettingsModel } from "../../apis/ChatPage/typings";

import { useChatPageStore } from "../../zustand/apis/ChatPage";

enum AvailableVoices {
  Heart = "Heart",
  Bella = "Bella",
  Nicole = "Nicole",
  Michael = "Michael",
  Santa = "Santa",
  Facebook = "Facebook",
}

interface SettingsDialogProps {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  title,
  isOpen,
  onClose,
}) => {
  const { userSettings, getUserSettings, updateUserSettings } =
    useChatPageStore();
  const [currentUserSettings, setCurrentUserSettings] =
    React.useState<UserSettingsModel | null>(null);
  const [isSaveDisabled, setIsSaveDisabled] = React.useState(true);

  React.useEffect(() => {
    getUserSettings();
  }, []);

  React.useEffect(() => {
    if (userSettings) {
      setCurrentUserSettings(userSettings);
    }
  }, [userSettings]);

  React.useEffect(() => {
    setIsSaveDisabled(false);
  }, [isOpen]);

  // Speech voice chooser menu
  const [isVoiceMenuOpen, setIsVoiceMenuOpen] = React.useState(false);
  const [voiceMenuAnchorEl, setVoiceMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const checkIfChanged = () => {
    return (
      currentUserSettings &&
      userSettings &&
      JSON.stringify(currentUserSettings) !== JSON.stringify(userSettings)
    );
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (checkIfChanged() && currentUserSettings) {
      setIsSaveDisabled(true);
      await updateUserSettings(currentUserSettings)
        .then(() => {
          onClose();
          setIsSaveDisabled(false);
        })
        .catch(() => {
          setIsSaveDisabled(false);
        });
    }
  };

  return (
    <>
      {currentUserSettings && (
        <Dialog
          open={isOpen}
          onClose={onClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <DialogTitle id="modal-modal-title">
            {title ? (
              <Typography variant="h6">{title}</Typography>
            ) : (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h6">Settings</Typography>
              </Stack>
            )}
          </DialogTitle>
          <DialogContent>
            <Box component="form" noValidate onSubmit={onSubmit}>
              {/* Change avatar and username */}
              <Stack direction="column">
                <FormControl>
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <FormLabel htmlFor="tts-voice">Speech Voice</FormLabel>
                    {/* Hard Code voices for now for 2, Dropdown menu */}
                    <ListItem
                      onClick={(event: {
                        currentTarget: React.SetStateAction<HTMLElement | null>;
                      }) => {
                        setVoiceMenuAnchorEl(event.currentTarget);
                        setIsVoiceMenuOpen(true);
                      }}
                    >
                      <Typography variant="body1">
                        {currentUserSettings.ttsName ?? AvailableVoices.Heart}
                      </Typography>
                    </ListItem>
                  </Stack>
                  <Menu
                    id="voice-menu"
                    anchorEl={voiceMenuAnchorEl}
                    open={isVoiceMenuOpen}
                    onClose={() => {
                      setIsVoiceMenuOpen(false);
                    }}
                  >
                    {Object.values(AvailableVoices).map((voice) => (
                      <MenuItem
                        key={voice}
                        onClick={() => {
                          setIsVoiceMenuOpen(false);
                          setCurrentUserSettings({
                            ...currentUserSettings,
                            ttsName: voice,
                          });
                        }}
                      >
                        {voice}
                      </MenuItem>
                    ))}
                  </Menu>
                </FormControl>
              </Stack>
              <DialogActions>
                <Button
                  autoFocus
                  onClick={onClose}
                  color="primary"
                  disabled={isSaveDisabled}
                >
                  Close
                </Button>
                <Button
                  id="submit-button"
                  type="submit"
                  color="primary"
                  disabled={!checkIfChanged() || isSaveDisabled}
                >
                  Save changes
                </Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
