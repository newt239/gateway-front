import React from "react";
import { useAtomValue } from "jotai";
import { pageTitleAtom } from "#/components/lib/jotai";

import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

const TopBar = () => {
  const pageTitle = useAtomValue(pageTitleAtom);

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
            {pageTitle}
          </Typography>
          <Box sx={{ display: "flex" }}>
            <Tooltip title="マニュアルを確認する">
              <IconButton
                onClick={() => {
                  window.open(
                    process.env.REACT_APP_MANUAL_URL || "/",
                    "_blank"
                  );
                }}
                size="large"
                color="inherit"
              >
                <HelpOutlineRoundedIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TopBar;
