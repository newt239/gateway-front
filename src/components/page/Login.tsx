import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import { tokenAtom, profileAtom, setTitle } from "#/components/lib/jotai";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";
import ReactGA from "react-ga4";

import {
  Grid,
  Alert,
  TextField,
  Button,
  Typography,
  Card,
  Link,
  CircularProgress,
} from "@mui/material";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IosShareIcon from "@mui/icons-material/IosShare";

import { handleApiError } from "#/components/lib/commonFunction";

const Login = () => {
  setTitle("ログイン");
  const setToken = useSetAtom(tokenAtom);
  const setProfile = useSetAtom(profileAtom);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [userIdValue, setUserIdValue] = useState<string>("");
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const login = () => {
    localStorage.setItem("user_id", userIdValue);
    setLoading(true);
    apiClient(process.env.REACT_APP_API_BASE_URL)
      .auth.login.$post({
        body: {
          user_id: userIdValue,
          password: passwordValue,
        },
      })
      .then((loginRes) => {
        localStorage.setItem("gatewayApiToken", loginRes.token);
        setToken(loginRes.token);
        apiClient(process.env.REACT_APP_API_BASE_URL)
          .auth.me.$get({
            headers: {
              Authorization: `Bearer ${loginRes.token}`,
            },
          })
          .then((meRes) => {
            setProfile(meRes);
            navigate("/", { replace: true });
            ReactGA.event({
              category: "login",
              action: "success",
              label: userIdValue,
            });
          })
          .catch((err: AxiosError) => {
            handleApiError(err, "get_user_info");
            setErrorMessage("ユーザー情報の取得に際しエラーが発生しました。");
          });
      })
      .catch((err: AxiosError) => {
        if (err.message === "Network Error") {
          setErrorMessage(
            "サーバーからの応答がありません。端末がネットワークに接続されているか確認してください。"
          );
        } else {
          setErrorMessage(
            "エラーが発生しました。ユーザーIDまたはパスワードが間違っている可能性があります。"
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
          <Grid container spacing={2} sx={{ p: 2 }}>
            {errorMessage && (
              <Grid item xs={12}>
                <Alert severity="error" variant="filled">
                  {errorMessage}
                </Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <form>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      id="user_id"
                      label="ユーザーID"
                      type="text"
                      autoComplete="username"
                      onChange={(event) => setUserIdValue(event.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          login();
                        }
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      id="password"
                      label="パスワード"
                      type="password"
                      autoComplete="current-password"
                      onChange={(event) => setPasswordValue(event.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          login();
                        }
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "1rem" }}>
                    {loading && <CircularProgress size={25} thickness={6} />}
                    <Button
                      onClick={login}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          login();
                        }
                      }}
                      variant="outlined"
                      disabled={
                        userIdValue.length === 0 || passwordValue.length === 0
                      }
                      size="large"
                      startIcon={<LoginRoundedIcon />}
                    >
                      ログイン
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
          <Typography variant="h2">ログイン出来ない場合</Typography>
          <ol>
            <li>
              ユーザーIDとパスワードが間違っていないかもう一度確認してください。
            </li>
            <li>
              「サーバーからの応答がありません」というエラーが表示された場合、端末のネットワークの設定を確認した上で
              <Link
                href={process.env.REACT_APP_STATUS_URL || "/"}
                target="_blank"
                underline="hover"
              >
                サーバーステータス
              </Link>
              に異常がないか確認してください。
            </li>
            <li>ログイン状態は一定の時間が経過するとログアウトされます。</li>
          </ol>
        </Card>
      </Grid>
      {!window.matchMedia("(display-mode: standalone)").matches && (
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
            <Typography variant="h2">アプリのインストール方法</Typography>
            <ol>
              <li>
                右上の <MoreVertIcon sx={{ verticalAlign: -5 }} />{" "}
                から『「Gateway」をインストール』をクリック
              </li>
              <li>
                Safariを利用している場合{" "}
                <IosShareIcon sx={{ verticalAlign: -5 }} />{" "}
                から「ホーム画面に追加」をタップ
              </li>
              <li>ホーム画面に追加された「Gateway」アイコンをタップして起動</li>
            </ol>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default Login;
