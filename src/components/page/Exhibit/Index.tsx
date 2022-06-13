import React, { useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { currentExhibitState } from "#/recoil/exhibit";

import { Grid, Card, Box, Typography, Button } from "@mui/material";
import SelectExhibit from "#/components/block/SelectExhibit";
import { pageStateSelector } from "#/recoil/page";
import { useSetRecoilState } from "recoil";

const ExhibitIndex = () => {
  const navigate = useNavigate();
  const setPageInfo = useSetRecoilState(pageStateSelector);

  useEffect(() => {
    setPageInfo({ title: "展示一覧" });
  }, []);

  type moveButtonProp = {
    type: "enter" | "exit";
  };
  const MoveButton = ({ type }: moveButtonProp) => {
    const currentExhibit = useRecoilValue(currentExhibitState);
    return (
      <Button
        onClick={() => navigate(`${currentExhibit.exhibit_id}/${type}`)}
        variant="outlined"
      >
        開く
      </Button>
    );
  };

  return (
    <>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Suspense fallback={<div>読み込み中...</div>}>
              <SelectExhibit />
            </Suspense>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h3">入室処理</Typography>
            <Typography>展示への入室を記録します。</Typography>
            <Box sx={{ width: "100%", textAlign: "right" }}>
              <Suspense fallback={<div>読み込み中...</div>}>
                <MoveButton type="enter" />
              </Suspense>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h3">退室処理</Typography>
            <Typography>展示からの退室を記録します。</Typography>
            <Box sx={{ width: "100%", textAlign: "right" }}>
              <Suspense fallback={<div>読み込み中...</div>}>
                <MoveButton type="exit" />
              </Suspense>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default ExhibitIndex;
