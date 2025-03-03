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

interface BrokeUniStudentProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const BrokeUniStudent: React.FC<BrokeUniStudentProps> = ({
  isOpen,
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
        <Typography variant="h6">I'm a Broke Uni Student</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="modal-modal-description">
          <Typography variant="body1">
            1. Please do not spam the Chatbot too much, it will hurt my wallet,
            as the APIs cost money (when the credit runs out that is)
          </Typography>
          <Typography variant="body1">
            2. Please do not submit too many images, the image API has an
            absolute limit on how many requests can be made.
          </Typography>
          <Typography variant="body1">
            3. Please do not submit documents with many embedded images, in the
            persona dashboard, as the image API has an absolute limit on how
            many requests can be made.
          </Typography>
          <Typography variant="body1">
            4. The forgot password do not work, please remember your password.
          </Typography>
          <Typography variant="body1">
            By clicking any button below, you agree to abide the above
            statements.
          </Typography>
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
