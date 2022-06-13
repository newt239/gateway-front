import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Grid, Card, Box, Typography, Button } from "@mui/material";
import { pageStateSelector } from "#/recoil/page";
import { useSetRecoilState } from "recoil";

const Entrance = () => {
  const navigate = useNavigate();
  const setPageInfo = useSetRecoilState(pageStateSelector);

  useEffect(() => {
    setPageInfo({ title: "エントランス" });
  }, []);

  return (
    <>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12} md={6} lg={4}>
          <Card variant="outlined" sx={{ width: "100%" }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h3">入場処理</Typography>
              <Typography>
                リストバンドと予約情報のデータの連携を行います。
              </Typography>
              <Box sx={{ width: "100%", textAlign: "right" }}>
                <Button
                  onClick={() => navigate("reserve-check")}
                  variant="outlined"
                >
                  開く
                </Button>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card variant="outlined" sx={{ width: "100%" }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h3">退場処理</Typography>
              <Typography>退場を記録します。</Typography>
              <Box sx={{ width: "100%", textAlign: "right" }}>
                <Button onClick={() => navigate("exit")} variant="outlined">
                  開く
                </Button>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Entrance;
