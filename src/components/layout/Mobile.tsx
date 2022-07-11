import React from "react";
import { Container, Toolbar } from "@mui/material";

import BottomNav from "#/components/layout/BottomNav";
import TopBar from "#/components/layout/TopBar";
import Body from "#/components/page/Body";

const Mobile = () => {
  return (
    <>
      <TopBar />
      <Container sx={{ display: "flex", flexWrap: "wrap", pb: 7 }}>
        <Toolbar sx={{ p: 1 }} />
        <Body />
      </Container>
      <BottomNav />
    </>
  );
};

export default Mobile;
