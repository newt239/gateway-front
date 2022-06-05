import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: '"Noto Sans JP", "BIZ UDPGothic"',
    h1: {
      fontSize: "1.5rem",
      fontWeight: 900,
      lineHeight: "3rem",
    },
    h2: {
      fontSize: "1.5rem",
      lineHeight: "2rem",
      fontWeight: 700,
    },
    h3: {
      fontSize: "1.3rem",
      fontWeight: 900,
    },
    h4: {
      fontSize: "1.3rem",
      fontWeight: 700,
    },
    body2: {
      padding: ".5rem 0",
    },
  },
});

export default theme;
