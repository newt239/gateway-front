import React from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
              onClick={() => navigate("/docs/", { replace: true })}
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
