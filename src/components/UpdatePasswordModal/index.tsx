import React from "react";

import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormLabel,
  Icon,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import * as styles from "./style.scss";
import { UserInfoModel } from "../../apis/ChatPage/typings";
import { UserRoleEnum } from "../../apis/enums";
import { UsernameChip } from "../UsernameChip";
import { FormatTextdirectionLToROutlined } from "@mui/icons-material";
import { validatePassword } from "../../utils";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface UpdatePasswordDialogProps {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  userInfo?: UserInfoModel;
  onSubmit: (oldPassword: string, newPassword: string) => void;
}

export const UpdatePasswordDialog: React.FC<UpdatePasswordDialogProps> = ({
  title,
  isOpen,
  onClose,
  userInfo,
  onSubmit: onSubmitProp,
}) => {
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");

  const [newPasswordError, setNewPasswordError] = React.useState(false);
  const [newPasswordErrorMessage, setNewPasswordErrorMessage] =
    React.useState("");

  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  const [showOldPassword, setShowOldPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);

  const validateChange = () => {
    if (!oldPassword) {
      setPasswordError(true);
      setPasswordErrorMessage("Old password is invalid");
      return false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!validatePassword(newPassword)) {
      setNewPasswordError(true);
      setNewPasswordErrorMessage("New password is invalid");
      return false;
    } else {
      setNewPasswordError(false);
      setNewPasswordErrorMessage("");
    }

    return true;
  };

  const checkIfChanged = () => {
    return validatePassword(newPassword);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validity = validateChange() && checkIfChanged();

    if (userInfo && validity) {
      const oldPassword = (
        document.getElementById("old-password") as HTMLInputElement
      )?.value;

      const newPassword = (
        document.getElementById("new-password") as HTMLInputElement
      )?.value;

      onSubmitProp(oldPassword, newPassword);
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
                <Typography variant="h6">Updating Password for</Typography>
                <UsernameChip userInfo={userInfo} />
              </Stack>
            )}
          </DialogTitle>
          <DialogContent>
            <Box component="form" noValidate onSubmit={onSubmit}>
              <Stack direction="column">
                <FormControl>
                  <FormLabel htmlFor="password">Old Password</FormLabel>
                  <TextField
                    id="old-password"
                    type={showOldPassword ? "text" : "password"}
                    name="old-password"
                    placeholder="Old Password"
                    autoComplete="old-password"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    color="primary"
                    sx={{ ariaLabel: "old-password" }}
                    error={passwordError}
                    helperText={passwordErrorMessage}
                    onChange={(e) => setOldPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        document.getElementById("new-password")?.focus();
                      }
                    }}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                          >
                            <Icon>
                              {showOldPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </Icon>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="password">Old Password</FormLabel>
                  <TextField
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    name="new-password"
                    placeholder="New Password"
                    autoComplete="new-password"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    color="primary"
                    sx={{ ariaLabel: "new-password" }}
                    error={newPasswordError}
                    helperText={newPasswordErrorMessage}
                    onChange={(e) => setNewPassword(e.target.value)}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            <Icon>
                              {showNewPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </Icon>
                          </InputAdornment>
                        ),
                      },
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
