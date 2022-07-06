import React from "react";
import { useRecoilValue } from "recoil";
import { pageStateSelector } from "#/recoil/page";

import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

const TopBar = () => {
  const pageProps = useRecoilValue(pageStateSelector);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{ width: { xs: "100%", sm: `calc(100% - 240px)` } }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Typography variant="h2" noWrap>
            {pageProps.title}
          </Typography>
          <Box sx={{ display: "flex" }}>
            <IconButton
              onClick={() => { window.location.href = process.env.REACT_APP_API_MANUAL_URL || "https://gateway.sh-fes.com/docs" }}
              size="large"
              color="inherit"
            >
              <HelpOutlineRoundedIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TopBar;
