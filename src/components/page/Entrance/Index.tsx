import React from "react";
import { useNavigate } from "react-router-dom";
import { setTitle } from "#/components/lib/jotai";

import {
  Grid,
  Card,
  Typography,
  CardActionArea,
  CardContent,
  Alert,
  AlertTitle,
} from "@mui/material";

const Entrance: React.VFC = () => {
  setTitle("エントランス");
  const navigate = useNavigate();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Alert severity="warning">
          <AlertTitle>リストバンド紐付け処理</AlertTitle>
          予約の人数分だけ<strong>連続でリストバンドをスキャン</strong>
          してから「すべて登録」を押してください。
        </Alert>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Card variant="outlined" sx={{ height: "100%" }}>
          <CardActionArea
            onClick={() => navigate("reserve-check")}
            sx={{ height: "100%" }}
          >
            <CardContent sx={{ p: 2, height: "100%" }}>
              <Typography variant="h3">入場処理</Typography>
              <Typography variant="body1" sx={{ p: 1 }}>
                予約情報をもとにリストバンドの登録を行います。
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Card variant="outlined" sx={{ height: "100%" }}>
          <CardActionArea
            onClick={() => navigate("exit")}
            sx={{ height: "100%" }}
          >
            <CardContent sx={{ p: 2, height: "100%" }}>
              <Typography variant="h3">退場処理</Typography>
              <Typography variant="body1" sx={{ p: 1 }}>
                栄東祭の会場からの退場を記録します。
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Card variant="outlined" sx={{ height: "100%" }}>
          <CardActionArea
            onClick={() => navigate("other-enter")}
            sx={{ height: "100%" }}
          >
            <CardContent sx={{ p: 2, height: "100%" }}>
              <Typography variant="h3">特別入場</Typography>
              <Typography variant="body1" sx={{ p: 1 }}>
                生徒の再入場及びその他特別なゲスト用の処理です。
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Entrance;
