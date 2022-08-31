import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { profileAtom, setTitle } from "#/components/lib/jotai";


import {
  Grid,
  Card,
  Typography,
  CardActionArea,
  CardContent,
  Alert,
  AlertTitle,
} from "@mui/material";

import SelectExhibit from "#/components/block/SelectExhibit";

const ExhibitIndex: React.VFC = () => {
  setTitle("展示選択");
  const navigate = useNavigate();
  const profile = useAtomValue(profileAtom);
  const [currentExhibit, setCurrentExhibit] = useState<string>("");

  return (
    <Grid container spacing={2}>
      {profile?.user_type === "moderator" && (
        <Grid item xs={12}>
          <Alert severity="warning">
            <AlertTitle>一括退室処理</AlertTitle>
            ステージについては管理者用アカウントから「滞在状況」ページ上で実行できます。
          </Alert>
        </Grid>
      )}
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
            sx={{ height: "100%" }}
          >
            <CardContent sx={{ p: 2, height: "100%" }}>
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
            sx={{ height: "100%" }}
          >
            <CardContent sx={{ p: 2, height: "100%" }}>
              <Typography variant="h3">退室処理</Typography>
              <Typography variant="body1" sx={{ p: 1 }}>
                展示からの退室を記録します。
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      {profile?.user_type === "moderator" && (
        <Grid item xs={12} md={6} lg={4}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardActionArea
              onClick={() => currentExhibit && navigate(`/analytics/exhibit/${currentExhibit}`, { replace: true })}
              sx={{ height: "100%" }}
            >
              <CardContent sx={{ p: 2, height: "100%" }}>
                <Typography variant="h3">滞在状況</Typography>
                <Typography variant="body1" sx={{ p: 1 }}>
                  展示に滞在中のゲストや過去の入室記録を表示します。
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default ExhibitIndex;
