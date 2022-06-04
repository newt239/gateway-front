import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { pageStateSelector } from "#/recoil/page";

import { Grid, Typography, Button } from "@mui/material";

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
        {props.type === "404" ? (
          <Typography>お探しのページは見つかりませんでした。</Typography>
        ) : (
          <Typography>このページを表示する権限がありません。</Typography>
        )}
        <Button onClick={() => navigate("/", { replace: true })}>
          トップに戻る
        </Button>
      </Grid>
    </>
  );
};

export default NotFound;
