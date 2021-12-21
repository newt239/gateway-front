import React from 'react';
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from '@mui/material';
import theme from './components/functional/theme';
import Menu from './components/ui/Menu';
import './App.css';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Menu />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
