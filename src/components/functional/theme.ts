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
            fontSize: '2rem',
            fontWeight: 900,
            lineHeight: '3rem'
        },
        h2: {
            fontSize: '1.8rem',
            fontWeight: 400,
            marginBottom: '1rem'
        }
    }
});

export default theme;