import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { pageStateSelector } from "#/recoil/page";

import { Grid, Card, Box, Typography, Button } from "@mui/material";

type extraProp = {
  type: "404" | "401";
};
const NotFound = (props: extraProp) => {
  const navigate = useNavigate();

  const setPageInfo = useSetRecoilState(pageStateSelector);
  useEffect(() => {
    setPageInfo({ title: "ホーム" });
  }, []);

  return (
    <>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
            {props.type === "404" ? (
              <Typography>お探しのページは見つかりませんでした。</Typography>
            ) : props.type === "401" ? (
              <Typography>このページを表示する権限がありません。</Typography>
            ) : (
              <Typography>何らかのエラーが発生しました。</Typography>
            )}
            <Box sx={{ textAlign: "right" }}>
              <Button
                onClick={() => navigate("/", { replace: true })}
                variant="outlined"
              >
                トップに戻る
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default NotFound;
