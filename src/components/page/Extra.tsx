import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import { pageTitleAtom, profileAtom, tokenAtom } from "#/components/lib/jotai";

import { Card, Box, Typography, Button } from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

type extraProp = {
  type: "404" | "401" | "unknown" | "loading";
};

const NotFound = (props: extraProp) => {
  const setPageTitle = useSetAtom(pageTitleAtom);
  const navigate = useNavigate();
  const setProfile = useSetAtom(profileAtom);
  const setToken = useSetAtom(tokenAtom);

  useEffect(() => {
    if (props.type !== "loading") {
      setPageTitle("エラー");
    }
  }, []);

  const logout = () => {
    setToken(null);
    setProfile(null);
    localStorage.removeItem("gatewayApiToken");
    navigate("/login", { replace: true });
  };

  return (
    <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
      {props.type === "404" ? (
        <Typography>お探しのページは見つかりませんでした。</Typography>
      ) : props.type === "401" ? (
        <Typography>このページを表示する権限がありません。</Typography>
      ) : props.type === "unknown" ? (
        <>
          <Typography>
            このアカウントは使えません。テスト用のアカウントである可能性があります。
          </Typography>
          <Typography>
            団体の代表者へメールでアカウントを配布しています。自分の団体に配られているアカウントを使用してください。
          </Typography>
          <Typography>
            メールを受け取っていない場合は技術部までお問い合わせください。
          </Typography>
        </>
      ) : props.type === "loading" ? (
        <Typography>ログインセッションの検証中...</Typography>
      ) : (
        <Typography>何らかのエラーが発生しました。</Typography>
      )}
      <Box sx={{ mt: 2, textAlign: "right" }}>
        <Button
          variant="outlined"
          color="error"
          onClick={logout}
          startIcon={<LogoutRoundedIcon />}
          sx={{ mr: 2 }}
        >
          ログアウト
        </Button>
        <Button
          onClick={() => navigate("/", { replace: true })}
          variant="outlined"
        >
          トップに戻る
        </Button>
      </Box>
    </Card>
  );
};

export default NotFound;
