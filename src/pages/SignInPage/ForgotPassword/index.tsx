import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  OutlinedInput,
} from "@mui/material";
import React from "react";

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

// Huge thanks to https://github.com/mui/material-ui/blob/v6.1.1/docs/data/material/getting-started/templates/sign-in/ForgotPassword.tsx
export const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  open,
  handleClose,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          handleClose();
        },
      }}
    >
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "90%",
        }}
      >
        <DialogContentText>
          Enter your account&apos;s email address, and we&apos;ll send you a
          link to reset your password.
        </DialogContentText>
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          placeholder="Email address"
          type="email"
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          type="submit"
          onClick={() => {
            alert("Lol, you thought this would work?");
          }}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};
