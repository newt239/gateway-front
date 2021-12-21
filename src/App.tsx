import React from 'react';
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from '@mui/material';
import theme from './components/functional/theme';
import ScreenWidth from './components/ui/ScreenWidth';
import './App.css';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <ScreenWidth />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
