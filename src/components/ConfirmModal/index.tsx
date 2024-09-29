import React, { ReactNode } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Icon,
  Stack,
  Typography,
} from "@mui/material";

interface ConfirmModalProps {
  isOpen: boolean;
  icon?: ReactNode;
  title?: string | ReactNode;
  content?: string | ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  icon = null,
  title = "Are you sure?",
  content = "This action cannot be undone.",
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogTitle id="modal-modal-title">
        <Stack direction="row" spacing={2}>
          {icon && <Icon>{icon}</Icon>}
          <Typography variant="h6">{title}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="modal-modal-description">
          <Typography variant="body1">{content}</Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
