import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactGA from "react-ga4";

import { Box, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "#/components/lib/theme";

import useDeviceWidth from "#/components/lib/useDeviceWidth";
import TopBar from "#/components/layout/TopBar";
import Drawer from "#/components/layout/Drawer";
import BottomNav from "#/components/layout/BottomNav";
import Body from "#/components/page/Body";

const App = () => {
  const { largerThanMD } = useDeviceWidth();
  ReactGA.initialize("G-1R85L99586");
  ReactGA.send("pageview");
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ display: "flex", flexDirection: largerThanMD ? "row" : "column" }}>
          {largerThanMD && <Drawer />}
          <Box sx={{ display: "flex", flexWrap: "wrap", flexGrow: 1, m: 0 }}>
            <TopBar />
            <Box sx={{
              height: largerThanMD ? "calc(100vh - 64px)" : "calc(100vh - 64px - 56px)",
              overflowY: "scroll",
              width: "100%",
              p: 2,
              zIndex: 200,
            }}>
              <Box maxWidth={1200}>
                <Body />
              </Box>
            </Box>
          </Box>
          {!largerThanMD && <BottomNav />}
        </Box>
      </BrowserRouter>
      <div className="SW-update-dialog"></div>
    </ThemeProvider>
  );
};

export default App;
