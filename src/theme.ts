import { createTheme, ThemeOptions } from "@mui/material/styles";

const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#1b1b1b",
    },
    secondary: {
      main: "#0065d5",
    },
    background: {
      default: "#f5f5f5",
      paper: "#dbdeea",
    },
  },
  typography: {
    fontFamily: `"Open Sans", "Roboto", sans-serif`,
    h6: {
      fontSize: "1.4rem",
      fontWeight: 500,
    },
    h5: {
      fontSize: "1.4rem",
      fontWeight: 600,
    },
    body2: {
      fontSize: "1rem",
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: "0.9rem",
      fontWeight: 400,
    },
  },
};

export const theme = createTheme(themeOptions);
