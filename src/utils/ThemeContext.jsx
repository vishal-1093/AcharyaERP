import { createTheme, ThemeProvider } from "@mui/material";
import { responsiveFontSizes } from "@mui/material";

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      primary: {
        main: "#4A57A9",
        light: "#B9C3FF",
        dark: "#182778",
      },
      secondary: {
        main: "#ED980E",
        light: "#FFB95C",
        dark: "#A96900",
      },
      error: {
        main: "#DD3730",
        light: "#FF897A",
        dark: "#930006",
      },
      button: {
        login: "#52ab98",
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
    },
    typography: {
      fontFamily: "Rubik, Open Sans, Roboto, sans-serif",
    },
  })
);

function ThemeContext({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default ThemeContext;
