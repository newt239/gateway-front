import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setTitle } from "#/components/lib/jotai";

import {
  Grid,
  Card,
  Typography,
  CardActionArea,
  CardContent,
} from "@mui/material";

import SelectExhibit from "#/components/block/SelectExhibit";

const ExhibitIndex: React.VFC = () => {
  setTitle("展示選択");
  const navigate = useNavigate();
  const [currentExhibit, setCurrentExhibit] = useState<string>("");

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container sx={{ pl: 2, alignItems: "center" }}>
          <Grid item xs={12} md="auto">
            スキャンする展示：
          </Grid>
          <Grid item xs={12} md={6}>
            <SelectExhibit
              currentExhibit={currentExhibit}
              setCurrentExhibit={setCurrentExhibit}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Card variant="outlined" sx={{ height: "100%" }}>
          <CardActionArea
            onClick={() =>
              currentExhibit && navigate(`${currentExhibit}/enter`)
            }
          >
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h3">入室処理</Typography>
              <Typography variant="body1" sx={{ p: 1 }}>
                展示への入室を記録します。
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Card variant="outlined" sx={{ height: "100%" }}>
          <CardActionArea
            onClick={() => currentExhibit && navigate(`${currentExhibit}/exit`)}
          >
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h3">退室処理</Typography>
              <Typography variant="body1" sx={{ p: 1 }}>
                展示からの退室を記録します。
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ExhibitIndex;
