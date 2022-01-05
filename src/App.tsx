import React from 'react';
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

import theme from '#/components/functional/theme';
import ScreenWidth from '#/components/ui/ScreenWidth';

require('dotenv').config()

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <ScreenWidth />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
