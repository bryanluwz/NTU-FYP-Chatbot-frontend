import React from "react";

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

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditUserDialog: React.FC<EditUserDialogProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogTitle id="modal-modal-title">
        <Stack direction="row" spacing={2}>
          <Icon>person</Icon>
          <Typography variant="h6">Update User</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="modal-modal-description">
          <Typography variant="body1">
            This feature is not available in the demo.
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
