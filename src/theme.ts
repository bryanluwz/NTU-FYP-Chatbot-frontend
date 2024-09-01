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
  },
};

export const theme = createTheme(themeOptions);
