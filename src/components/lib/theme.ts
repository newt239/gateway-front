import { createTheme } from "@mui/material/styles";
import { blue, grey } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: blue[500],
    },
    action: {
      hoverOpacity: 0.2,
      selectedOpacity: 0.2,
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
      whiteSpace: "nowrap",
    },
    h4: {
      fontSize: "1.3rem",
      fontWeight: 700,
    },
    body2: {
      padding: ".5rem 0",
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        #root {
          overflow-y: hidden;
          cursor: default;
        }
        ::-webkit-scrollbar {
          width: .3rem;
          height: .3rem;
          z-index: 100000;
        }
        ::-webkit-scrollbar-thumb {
          background-color: ${grey[500]};
          border-radius: 10px;
        }
        .qrcode {
          margin: auto;
          width: 100%;
        }
        .qrcode section video {
          border-radius: 10px;
        }
      `,
    },
  },
});

export default theme;
