import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#009688',
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
        }
    }
});

export default theme;