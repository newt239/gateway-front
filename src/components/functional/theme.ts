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
        },
        h2: {
            fontSize: '1.8rem',
            fontWeight: 800,
            marginBottom: '1rem'
        }
    }
});

export default theme;