import React, { useState, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { pageStateSelector } from "#/recoil/page";
import moment, { Moment } from "moment";

import { Grid, Card, Box, Button, Typography } from "@mui/material";

import UserInfo from "#/components/block/UserInfo";

import GatewayThumbnail from '#/images/gateway-home-thumbnail.png';

const Home = () => {
  const navigate = useNavigate();
  const [datetime, setDatetime] = useState<Moment>(moment());

  const setPageInfo = useSetRecoilState(pageStateSelector);
  useEffect(() => {
    setPageInfo({ title: "ホーム" });
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDatetime(moment());
    }, 60 * 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12}>
        <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
          <Box sx={{ width: "100%", textAlign: "center" }}>
            <img src={GatewayThumbnail} />
          </Box>
        </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
          <Suspense fallback={<p>hey</p>}>
            <UserInfo />
          </Suspense>
        </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
          <Typography variant="h3">
            {datetime.format("M月D日 H時m分")}
          </Typography>
          <Typography variant="body2">次の時間枠まであと{ }分</Typography>
        </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
          <Typography variant="h3">校内滞在者数</Typography>
          <Typography variant="body2">ここに人数とか棒グラフとか</Typography>
          <Box sx={{ width: "100%", textAlign: "right" }}>
            <Button onClick={() => navigate("crowd")} variant="outlined">
              詳細
            </Button>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Home;
