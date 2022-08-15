import React, { useEffect, Suspense } from "react";
import { useSetAtom } from "jotai";
import { pageTitleAtom } from "#/components/lib/jotai";

import { Grid, Card, Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import LibraryBooksRoundedIcon from "@mui/icons-material/LibraryBooksRounded";

import UserInfo from "#/components/block/UserInfo";
import Version from "#/components/block/Version";
import Settings from "#/components/block/Settings";

import GatewayThumbnail from "#/asset/gateway-hero.jpg";

const Home = () => {
  const setPageTitle = useSetAtom(pageTitleAtom);
  useEffect(() => {
    setPageTitle("ホーム");
  }, []);

  const theme = useTheme();
  const largerThanMD = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Grid container spacing={2} sx={{ py: 2 }}>
      <Grid item xs={12}>
        <Box sx={{ textAlign: "center", p: 2, height: "100%" }}>
          <img
            src={GatewayThumbnail}
            style={{
              width: "100%",
              maxWidth: "80vh",
              maxHeight: "35vh",
              objectFit: "cover",
            }}
          />
        </Box>
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
