import { createTheme } from '@mui/material/styles';
import { teal } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        primary: {
            main: teal[500],
        },
    },
    typography: {
        // Use the system font instead of the default Roboto font.
        fontFamily: '"Noto Sans JP", "BIZ UDPGothic"',
        h1: {
            fontSize: '1.5rem',
            fontWeight: 900,
            lineHeight: '3rem'
        },
        h2: {
            fontSize: '1.5rem',
            fontWeight: 700,
        },
        h3: {
            fontSize: '1.3rem',
            fontWeight: 900,
        },
        h4: {
            fontSize: '1.3rem',
            fontWeight: 700
        },
        body2: {
            padding: ".5rem 0",
        },
    }
});

export default theme;