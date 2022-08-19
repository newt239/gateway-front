import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import { pageTitleAtom } from "#/components/lib/jotai";

import {
  Grid,
  Card,
  Typography,
  CardActionArea,
  CardContent,
} from "@mui/material";

const Entrance = () => {
  const navigate = useNavigate();

  const setPageTitle = useSetAtom(pageTitleAtom);
  useEffect(() => {
    setPageTitle("エントランス");
  }, []);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={6}>
        <Card variant="outlined">
          <CardActionArea onClick={() => navigate("reserve-check")}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h3">入場処理</Typography>
              <Typography variant="body1" sx={{ p: 1 }}>
                予約情報をもとにリストバンドの登録を行います。
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card variant="outlined">
          <CardActionArea onClick={() => navigate("exit")}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h3">退場処理</Typography>
              <Typography variant="body1" sx={{ p: 1 }}>
                栄東祭の会場からの退場を記録します。
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Entrance;
