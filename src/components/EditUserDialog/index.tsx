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
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { UserInfoModel } from "../../apis/ChatPage/typings";

import { UserRoleEnum } from "../../apis/enums";
import { UsernameChip } from "../UsernameChip";
import { validateEmail, validateUsername } from "../../utils";

interface EditUserDialogProps {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  userInfo?: UserInfoModel;
  onSubmit: (userInfo: UserInfoModel) => void;
  editorRole: UserRoleEnum; // User / Educator can change username, avatar and password, Admin can change all fields except password and avatar
}

enum InputFieldEnum {
  Username = "username",
  Email = "email",
  Role = "role",
  Avatar = "avatar",
}

export const EditUserDialog: React.FC<EditUserDialogProps> = ({
  title,
  isOpen,
  onClose,
  userInfo,
  onSubmit: onSubmitProp,
  editorRole,
}) => {
  const [inputFields, setInputFields] = React.useState<InputFieldEnum[]>([]);
  const [newAvatarSrc, setNewAvatarSrc] = React.useState<string | null>(null);
  const [fileInputRef, setFileInputRef] =
    React.useState<HTMLInputElement | null>(null);

  const [newUsername, setNewUsername] = React.useState("");
  const [usernameError, setUsernameError] = React.useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = React.useState("");

  const [newEmail, setNewEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");

  React.useEffect(() => {
    if (userInfo) {
      setNewUsername(userInfo.username);
      setNewEmail(userInfo.email);
    }
  }, [userInfo]);

  React.useEffect(() => {
    if (
      editorRole === UserRoleEnum.User ||
      editorRole === UserRoleEnum.Educator
    ) {
      setInputFields([InputFieldEnum.Username, InputFieldEnum.Avatar]);
    } else {
      setInputFields([InputFieldEnum.Email]);
    }
  }, [editorRole]);

  const validateChange = () => {
    const avatar = (document.getElementById("avatar") as HTMLInputElement)
      ?.value;

    if (
      inputFields.includes(InputFieldEnum.Username) &&
      !validateUsername(newUsername)
    ) {
      setUsernameError(true);
      setUsernameErrorMessage("Please enter a valid username.");
      return false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage("");
    }

    if (
      inputFields.includes(InputFieldEnum.Email) &&
      !validateEmail(newEmail)
    ) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      return false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    return true;
  };

  const checkIfChanged = () => {
    const avatar = newAvatarSrc;

    if (
      userInfo &&
      newUsername === userInfo.username &&
      newEmail === userInfo.email &&
      !avatar
    ) {
      return false;
    }

    return true;
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validity = validateChange() && checkIfChanged();

    if (userInfo && validity) {
      const username = (document.getElementById("username") as HTMLInputElement)
        ?.value;
      const email = (document.getElementById("email") as HTMLInputElement)
        ?.value;

      const updatedUserInfo: UserInfoModel = {
        ...userInfo,
        username: username || userInfo.username,
        email: email || userInfo.email,
        avatar: newAvatarSrc || userInfo.avatar,
      };

      setNewAvatarSrc(null);

      onSubmitProp(updatedUserInfo);
    }
  };

  return (
    <>
      {userInfo && (
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
                <Typography variant="h6">Editing</Typography>
                <UsernameChip userInfo={userInfo} />
              </Stack>
            )}
          </DialogTitle>
          <DialogContent>
            <Box component="form" noValidate onSubmit={onSubmit}>
              {/* Change avatar and username */}
              <Stack direction="column">
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <FormControl
                    disabled={!inputFields.includes(InputFieldEnum.Avatar)}
                  >
                    <FormLabel htmlFor="avatar">Avatar</FormLabel>
                    <Stack direction="row" spacing={1}>
                      <Avatar
                        src={newAvatarSrc || userInfo.avatar}
                        sx={{
                          height: "100%",
                          aspectRatio: "1 / 1",
                          objectFit: "cover",
                        }}
                      >
                        {userInfo.username.charAt(0)}
                      </Avatar>

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          fileInputRef?.click();
                        }}
                      >
                        Change Avatar
                        <input
                          ref={setFileInputRef}
                          id="avatar"
                          name="avatar"
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setNewAvatarSrc(e.target?.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </Button>
                    </Stack>
                  </FormControl>
                  <FormControl
                    disabled={!inputFields.includes(InputFieldEnum.Username)}
                  >
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <TextField
                      disabled={!inputFields.includes(InputFieldEnum.Username)}
                      id="username"
                      type="username"
                      name="username"
                      placeholder="username"
                      autoComplete="username"
                      autoFocus
                      required
                      fullWidth
                      variant="outlined"
                      color="primary"
                      sx={{ ariaLabel: "username" }}
                      error={usernameError}
                      defaultValue={userInfo.username}
                      helperText={usernameErrorMessage}
                      onChange={(e) => {
                        setNewUsername(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          document.getElementById("email")?.focus();
                        }
                      }}
                    />
                  </FormControl>
                </Stack>
                <FormControl
                  disabled={!inputFields.includes(InputFieldEnum.Email)}
                >
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <TextField
                    disabled={!inputFields.includes(InputFieldEnum.Email)}
                    id="email"
                    type="email"
                    name="email"
                    placeholder="email"
                    autoComplete="email"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    color="primary"
                    sx={{ ariaLabel: "email" }}
                    defaultValue={userInfo.email}
                    error={emailError}
                    helperText={emailErrorMessage}
                    onChange={(e) => {
                      setNewEmail(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        document.getElementById("role")?.focus();
                      }
                    }}
                  />
                </FormControl>
              </Stack>
              <DialogActions>
                <Button autoFocus onClick={onClose} color="primary">
                  Close
                </Button>
                <Button
                  id="submit-button"
                  type="submit"
                  color="primary"
                  disabled={!checkIfChanged()}
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
