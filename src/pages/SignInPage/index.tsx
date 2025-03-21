import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Icon,
  InputAdornment,
  Link,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import MuiCard from "@mui/material/Card";

import { ForgotPassword } from "./ForgotPassword";
import { useAuthStore } from "../../zustand/apis/Auth";
import { AuthContext } from "../../context/AuthContext";
import { validateEmail, validatePassword } from "../../utils";
import { BrokeUniStudent } from "../../components/BrokeUniStudent";

// Huge thanks to https://github.com/mui/material-ui/blob/v6.1.1/docs/data/material/getting-started/templates/sign-in/SignIn.tsx
const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  padding: 20,
  marginTop: "10vh",
  width: "100%",
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export const SignInPage: React.FC = () => {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");

  const [usernameError, setUsernameError] = React.useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = React.useState("");

  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = React.useState(false);
  const [isWarningOpen, setIsWarningOpen] = React.useState(false);

  const [isSignUp, setIsSignUp] = React.useState(false);

  const { login, register } = useAuthStore();
  const { login: authLoginHandler } = React.useContext(AuthContext);

  const [showPassword, setShowPassword] = React.useState(false);

  const handleForgotPasswordOpen = (event: React.MouseEvent) => {
    event.preventDefault();
    if (event.target === document.activeElement) {
      setIsForgotPasswordOpen(true);
    }
  };

  const handleForgotPasswordClose = () => {
    setIsForgotPasswordOpen(false);
  };

  const handleWarningOpen = () => {
    setIsWarningOpen(true);
  };

  const handleWarningClose = () => {
    alert(
      "You have agreed to the terms and conditions. This message will not appear again after signing up. :3"
    );
    setIsWarningOpen(false);
  };

  React.useEffect(() => {
    if (isSignUp) {
      handleWarningOpen();
    }
  }, [isSignUp]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleLogin();
  };

  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    let isValid = true;

    // Only validate email if it's a sign up page
    if (!validateEmail(email.value) && isSignUp) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (isSignUp) {
      const username = document.getElementById("username") as HTMLInputElement;

      if (!username.value) {
        setUsernameError(true);
        setUsernameErrorMessage("Please enter a username.");
        isValid = false;
      } else {
        setUsernameError(false);
        setUsernameErrorMessage("");
      }
    }

    if (!validatePassword(password.value)) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  // Login and register in the same function, funnt innit?
  const handleLogin = async () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    let loginError = false;

    if (validateInputs()) {
      if (isSignUp) {
        const username = document.getElementById(
          "username"
        ) as HTMLInputElement;
        loginError = await register(
          username.value,
          email.value,
          password.value,
          authLoginHandler
        );
      } else if (!isSignUp) {
        loginError = await login(email.value, password.value, authLoginHandler);
      }

      if (!loginError) {
        setEmailError(false);
        setEmailErrorMessage("");

        setPasswordError(true);
        setPasswordErrorMessage("Incorrect email or password.");
      }
    }
  };

  return (
    <SignInContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        {/* <SitemarkIcon /> */}
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Sign {isSignUp ? "Up" : "In"}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          {isSignUp && (
            <FormControl>
              <FormLabel htmlFor="username">Username</FormLabel>
              <TextField
                error={usernameError}
                helperText={usernameErrorMessage}
                id="username"
                type="username"
                name="username"
                placeholder="username"
                autoComplete="username"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={usernameError ? "error" : "primary"}
                sx={{ ariaLabel: "username" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    document.getElementById("email")?.focus();
                  }
                }}
              />
            </FormControl>
          )}
          <FormControl>
            <FormLabel htmlFor="email">
              {isSignUp ? "Email" : "Email or Username"}
            </FormLabel>
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={emailError ? "error" : "primary"}
              sx={{ ariaLabel: "email" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  document.getElementById("password")?.focus();
                }
              }}
            />
          </FormControl>
          <FormControl>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Link
                component="button"
                onClick={handleForgotPasswordOpen}
                variant="body2"
                sx={{ alignSelf: "baseline" }}
              >
                Forgot your password?
              </Link>
            </Box>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              placeholder="••••••"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={passwordError ? "error" : "primary"}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <Icon>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </Icon>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </FormControl>
          <ForgotPassword
            open={isForgotPasswordOpen}
            handleClose={handleForgotPasswordClose}
          />
          <BrokeUniStudent
            isOpen={isWarningOpen}
            onCancel={handleWarningClose}
            onConfirm={handleWarningClose}
          />
          <Button
            id="submit-button"
            type="submit"
            fullWidth
            variant="contained"
          >
            Sign {isSignUp ? "Up" : "In"}
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <span>
              <Link
                onClick={() => setIsSignUp(!isSignUp)}
                variant="body2"
                sx={{ alignSelf: "center" }}
              >
                Sign {isSignUp ? "In" : "Up"}
              </Link>
            </span>
          </Typography>
        </Box>
      </Card>
    </SignInContainer>
  );
};
