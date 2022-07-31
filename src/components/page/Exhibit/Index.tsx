import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { pageStateSelector } from "#/recoil/page";
import { currentExhibitState } from "#/recoil/exhibit";

import { Grid, Card, Box, Typography, Button } from "@mui/material";
import SelectExhibit from "#/components/block/SelectExhibit";


const ExhibitIndex = () => {
  const navigate = useNavigate();
  const setPageInfo = useSetRecoilState(pageStateSelector);

  useEffect(() => {
    setPageInfo({ title: "展示選択" });
  }, []);

  type moveButtonProp = {
    type: "enter" | "exit";
  };
  const MoveButton = ({ type }: moveButtonProp) => {
    const currentExhibit = useRecoilValue(currentExhibitState);
    return (
      <Button
        disabled={!currentExhibit}
        onClick={() => currentExhibit && navigate(`${currentExhibit}/${type}`)}
        variant="outlined"
      >
        開く
      </Button>
    );
  };

  return (
    <>
      <Grid container spacing={2} sx={{ py: 2 }}>
        <Grid item xs={12}>
          <Grid container sx={{ pl: 2, alignItems: "center" }}>
            <Grid item xs={12} md="auto">スキャンする展示：</Grid>
            <Grid item xs={12} md={6}>
              <SelectExhibit />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h3">入室処理</Typography>
            <Typography>展示への入室を記録します。</Typography>
            <Box sx={{ width: "100%", textAlign: "right" }}>
              <MoveButton type="enter" />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h3">退室処理</Typography>
            <Typography>展示からの退室を記録します。</Typography>
            <Box sx={{ width: "100%", textAlign: "right" }}>
              <MoveButton type="exit" />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default ExhibitIndex;
