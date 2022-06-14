import React, { useEffect, Suspense } from "react";
import { useSetRecoilState } from "recoil";
import { pageStateSelector } from "#/recoil/page";

import { Grid, Card, Box } from "@mui/material";

import UserInfo from "#/components/block/UserInfo";

import GatewayThumbnail from "#/images/gateway-home-thumbnail.png";

const Home = () => {
  const setPageInfo = useSetRecoilState(pageStateSelector);
  useEffect(() => {
    setPageInfo({ title: "ホーム" });
  }, []);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12}>
        <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
          <Box sx={{ textAlign: "center" }}>
            <img
              src={GatewayThumbnail}
              style={{ width: "100%", maxWidth: "750px" }}
            />
          </Box>
        </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
          <Suspense fallback={<p>読み込み中...</p>}>
            <UserInfo />
          </Suspense>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Home;
