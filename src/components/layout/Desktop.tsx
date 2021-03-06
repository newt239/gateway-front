import React from "react";
import { Container, Box, Toolbar } from "@mui/material";

import Drawer from "#/components/layout/Drawer";
import TopBar from "#/components/layout/TopBar";
import Body from "#/components/page/Body";

const Desktop = () => {
  return (
    <>
      <TopBar />
      <Box sx={{ display: "flex" }}>
        <Drawer />
        <Container sx={{ display: "flex", flexWrap: "wrap", m: 0 }}>
          <Toolbar sx={{ p: 2 }} />
          <Body />
        </Container>
      </Box>
    </>
  );
};

export default Desktop;
