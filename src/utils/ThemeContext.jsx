import { createTheme, ThemeProvider } from "@mui/material";
import { responsiveFontSizes } from "@mui/material";

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      primary: {
        main: "#4A57A9",
        light: "#EFEFFF",
        dark: "#182778",
      },
      secondary: {
        main: "#73768B",
        light: "#DFE1FA",
        dark: "#2C2F41",
      },
      success: {
        main: "#37A370",
        light: "#8FF7BD",
        dark: "#005231",
      },
      error: {
        main: "#DD3730",
        light: "#FF897A",
        dark: "#930006",
      },
      orange: {
        main: "#ED980E",
        light: "#FFB95C",
        dark: "#A96900",
      },
      blue: {
        main: "#003354",
        light: "#4597D7",
        dark: "#001D33",
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
      fontFamily: "Open Sans, sans-serif",
    },
  })
);

function ThemeContext({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default ThemeContext;
