import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactGA from "react-ga4";

import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import theme from "#/components/lib/theme";
import ScreenWidth from "#/components/layout/ScreenWidth";

const App = () => {
  ReactGA.initialize("G-1R85L99586");
  ReactGA.send("pageview");
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <ScreenWidth />
      </BrowserRouter>
      <div className="SW-update-dialog"></div>
    </ThemeProvider>
  );
};

export default App;
