import React, { Suspense } from "react";
import { setTitle } from "#/components/lib/jotai";

import { Grid, Card, Box, Typography, Button } from "@mui/material";
import LibraryBooksRoundedIcon from "@mui/icons-material/LibraryBooksRounded";

import GatewayThumbnail from "#/asset/gateway-hero.jpg";
import useDeviceWidth from "#/components/lib/useDeviceWidth";
import UserInfo from "#/components/block/UserInfo";
import Version from "#/components/block/Version";
import Settings from "#/components/block/Settings";
import QuickMenu from "#/components/block/QuickMenu";

const Home: React.VFC = () => {
  setTitle("ホーム");
  const { largerThanMD } = useDeviceWidth();

  return (
    <>
      {localStorage.getItem("viewOnly") === "yes" ? (
        <Typography variant="body1">閲覧専用</Typography>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} lg={8}>
            <Box
              sx={{
                textAlign: "center",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
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
            <QuickMenu />
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
      )}
    </>
  );
};

export default Home;
