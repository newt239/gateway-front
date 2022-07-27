import React, { useEffect, Suspense } from "react";
import { useSetRecoilState } from "recoil";
import { pageStateSelector } from "#/recoil/page";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Grid, Card, Box, Typography, Button } from "@mui/material";

import UserInfo from "#/components/block/UserInfo";
import Version from "#/components/block/Version";
import Settings from "#/components/block/Settings";

import LibraryBooksRoundedIcon from "@mui/icons-material/LibraryBooksRounded";

import GatewayThumbnail from "#/asset/gateway-hero.jpg";

const Home = () => {
  const setPageInfo = useSetRecoilState(pageStateSelector);
  useEffect(() => {
    setPageInfo({ title: "ホーム" });
  }, []);

  const theme = useTheme();
  const largerThanMD = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12}>
        <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
          <Box sx={{ textAlign: "center" }}>
            <img
              src={GatewayThumbnail}
              style={{
                width: "100%",
                maxWidth: "750px",
                maxHeight: "50vh",
                objectFit: "cover",
              }}
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
      <Grid item xs={12} md={6} lg={4}>
        <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
          <Grid
            container
            sx={{
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <Typography variant="h3">アプリ情報</Typography>
            <Version />
            <Box sx={{ width: "100%", textAlign: "right" }}>
              <Button
                variant="outlined"
                color="info"
                onClick={() => {
                  window.open(
                    process.env.REACT_APP_MANUAL_URL || "/",
                    "_blank"
                  );
                }}
                sx={{ mt: 2 }}
                startIcon={<LibraryBooksRoundedIcon />}
              >
                操作方法
              </Button>
            </Box>
          </Grid>
        </Card>
      </Grid>
      {largerThanMD && (
        <Grid item xs={12} md={6} lg={4}>
          <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
            <Typography variant="h3">アプリ設定</Typography>
            <Settings />
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default Home;
