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
import { validateUsername } from "../../utils";
import { PersonaModel } from "../../apis/Persona/typings";

interface CreatePersonaDialogProps {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  personaInfo?: PersonaModel;
  onSubmit: (personaInfo: PersonaModel) => void;
  editorRole: UserRoleEnum; // User / Educator can change personaName, avatar and password, Admin can change all fields except password and avatar
}

enum InputFieldEnum {
  Name = "name",
  Description = "description",
}

export const CreatePersonaDialog: React.FC<CreatePersonaDialogProps> = ({
  title,
  isOpen,
  onClose,
  personaInfo,
  onSubmit: onSubmitProp,
  editorRole,
}) => {
  const [inputFields, setInputFields] = React.useState<InputFieldEnum[]>([]);
  const [newAvatarSrc, setNewAvatarSrc] = React.useState<string | null>(null);
  const [fileInputRef, setFileInputRef] =
    React.useState<HTMLInputElement | null>(null);

  const [newName, setNewName] = React.useState("");
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");

  const [newDescription, setNewDescription] = React.useState("");
  const [descriptionError, setDescriptionError] = React.useState(false);
  const [descriptionErrorMessage, setDescriptionErrorMessage] =
    React.useState("");

  React.useEffect(() => {
    if (personaInfo) {
      setNewName(personaInfo.personaName);
      setNewDescription(personaInfo.personaDescription);
    }
  }, [personaInfo]);

  React.useEffect(() => {
    if (
      editorRole === UserRoleEnum.Educator ||
      editorRole === UserRoleEnum.Admin
    ) {
      setInputFields([InputFieldEnum.Name, InputFieldEnum.Description]);
    } else {
      setInputFields([]);
    }
  }, [editorRole]);

  const validateChange = () => {
    const avatar = (document.getElementById("avatar") as HTMLInputElement)
      ?.value;

    if (
      inputFields.includes(InputFieldEnum.Name) &&
      !validateUsername(newName)
    ) {
      setNameError(true);
      setNameErrorMessage("Please enter a valid name.");
      return false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    if (
      inputFields.includes(InputFieldEnum.Description) &&
      !validateUsername(newDescription)
    ) {
      setDescriptionError(true);
      setDescriptionErrorMessage("Please enter a valid description.");
      return false;
    } else {
      setDescriptionError(false);
      setDescriptionErrorMessage("");
    }

    return true;
  };

  const checkIfChanged = () => {
    const avatar = newAvatarSrc;

    if (
      personaInfo &&
      newName === personaInfo.personaName &&
      newDescription === personaInfo.personaDescription &&
      !avatar
    ) {
      return false;
    }

    return true;
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validity = validateChange() && checkIfChanged();

    if (personaInfo && validity) {
      const personaName = (
        document.getElementById("personaName") as HTMLInputElement
      )?.value;
      const description = (
        document.getElementById("description") as HTMLInputElement
      )?.value;

      const updatedPersonaInfo: PersonaModel = {
        ...personaInfo,
        personaName: personaName || personaInfo.personaName,
        personaDescription: description || personaInfo.personaDescription,
        personaAvatar: newAvatarSrc || undefined,
      };

      setNewAvatarSrc(null);

      onSubmitProp(updatedPersonaInfo);
    }
  };

  return (
    personaInfo && (
      <>
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
                <UsernameChip
                  userInfo={
                    {
                      username: personaInfo.personaName,
                      avatar: personaInfo.personaAvatar,
                    } as unknown as UserInfoModel
                  }
                />
              </Stack>
            )}
          </DialogTitle>
          <DialogContent>
            <Box component="form" noValidate onSubmit={onSubmit}>
              {/* Create username */}
              <Stack direction="column" gap={1}>
                <FormControl
                  disabled={!inputFields.includes(InputFieldEnum.Name)}
                >
                  <FormLabel htmlFor="personaName">Persona Name</FormLabel>
                  <TextField
                    disabled={!inputFields.includes(InputFieldEnum.Name)}
                    id="personaName"
                    type="personaName"
                    name="personaName"
                    placeholder="personaName"
                    autoComplete="personaName"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    color="primary"
                    sx={{ ariaLabel: "personaName" }}
                    error={nameError}
                    defaultValue={personaInfo?.personaName}
                    helperText={nameErrorMessage}
                    onChange={(e) => {
                      setNewName(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        document.getElementById("description")?.focus();
                      }
                    }}
                  />
                </FormControl>
                {/* Create Description */}
                <FormControl
                  disabled={!inputFields.includes(InputFieldEnum.Description)}
                >
                  <FormLabel htmlFor="description">
                    Persona Description
                  </FormLabel>
                  <TextField
                    disabled={!inputFields.includes(InputFieldEnum.Description)}
                    id="description"
                    type="description"
                    name="description"
                    placeholder="description"
                    autoComplete="description"
                    autoFocus
                    required
                    fullWidth
                    multiline // make multiline
                    variant="outlined"
                    color="primary"
                    sx={{ ariaLabel: "description" }}
                    defaultValue={personaInfo?.personaDescription}
                    error={descriptionError}
                    helperText={descriptionErrorMessage}
                    onChange={(e) => {
                      setNewDescription(e.target.value);
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
      </>
    )
  );
};
