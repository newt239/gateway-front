import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { pageStateSelector } from "#/recoil/page";

import { Grid, Typography, Button } from "@mui/material";

type extraProps = {
  kind: string;
}

const NotFound = (props: extraProps) => {
  const navigate = useNavigate();

  const setPageInfo = useSetRecoilState(pageStateSelector);
  useEffect(() => {
    setPageInfo({ title: "ホーム" });
  }, []);

  return (
    <>
      {props.kind === "not-found" ? (
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Typography>お探しのページは見つかりませんでした。</Typography>
          <Button onClick={() => navigate("/", { replace: true })}>
            トップに戻る
          </Button>
        </Grid>
      ) : (
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Typography>ログインしていません。</Typography>
          <Button onClick={() => navigate("/login", { replace: true })}>
            ログインページへ
          </Button>
        </Grid>
      )
      }</>);
};

export default NotFound;
