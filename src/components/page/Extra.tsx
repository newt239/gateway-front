import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import { pageTitleAtom } from "#/components/lib/jotai";

import { Grid, Card, Box, Typography, Button } from "@mui/material";

type extraProp = {
  type: "404" | "401" | "unknown" | "loading";
};

const NotFound = (props: extraProp) => {
  const navigate = useNavigate();
  const setPageTitle = useSetAtom(pageTitleAtom);
  useEffect(() => {
    if (props.type === "loading") {
      setPageTitle("Gateway");
    } else {
      setPageTitle("エラー");
    }
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
            ) : props.type === "unknown" ? (
              <>
                <Typography>このアカウントは使えません。テスト用のアカウントである可能性があります。</Typography>
                <Typography>団体の代表者へメールでアカウントを配布しています。自分の団体に配られているアカウントを使用してください。</Typography>
                <Typography>メールを受け取っていない場合は技術部までお問い合わせください。</Typography>
              </>
            ) : props.type === "loading" ? (
              <Typography>ログインセッションの検証中...</Typography>
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
