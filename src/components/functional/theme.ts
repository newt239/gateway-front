import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#009688',
        },
    },
    typography: {
        // Use the system font instead of the default Roboto font.
        fontFamily: '"BIZ UDPGothic"',
        h1: {
            fontSize: '2rem',
            fontWeight: '800'
        }
    }
});

export default theme;