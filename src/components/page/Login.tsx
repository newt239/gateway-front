import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import ReactGA from "react-ga4";
import { tokenState, profileState } from "#/recoil/user";
import { pageStateSelector } from "#/recoil/page";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";

import {
  Grid,
  Alert,
  TextField,
  Button,
  LinearProgress,
  Typography,
  Card,
} from "@mui/material";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IosShareIcon from "@mui/icons-material/IosShare";

interface messageType {
  display: "none" | "block";
  severity: "error" | "success";
  message: string;
}

const Login = () => {
  const setToken = useSetRecoilState(tokenState);
  const setProfile = useSetRecoilState(profileState);
  const setPageInfo = useSetRecoilState(pageStateSelector);
  useEffect(() => {
    setPageInfo({ title: "ログイン" });
  }, []);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [inputValue, updateValue] = useState({ user_id: "", password: "" });
  const [message, updateMessage] = useState<messageType>({
    display: "none",
    severity: "error",
    message: "",
  });

  const login = () => {
    if (inputValue.user_id !== "") {
      setLoading(true);
      apiClient(process.env.REACT_APP_API_BASE_URL)
        .auth.login.$post({
          body: inputValue,
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
              updateMessage({
                display: "block",
                severity: "success",
                message: "ログインに成功しました。",
              });
              setProfile(meRes);
              navigate("/", { replace: true });
              ReactGA.event({
                category: "login",
                action: "success",
                label: inputValue.user_id,
              });
            })
            .catch((err: AxiosError) => {
              console.log(err);
              updateMessage({
                display: "block",
                severity: "error",
                message: "ユーザー情報の取得に際しエラーが発生しました。",
              });
            });
        })
        .catch((err: AxiosError) => {
          if (err.message === "Network Error") {
            updateMessage({
              display: "block",
              severity: "error",
              message:
                "サーバーからの応答がありません。担当者に問い合わせてください。",
            });
          } else {
            updateMessage({
              display: "block",
              severity: "error",
              message:
                "エラーが発生しました。ユーザーidまたはパスワードが間違っている可能性があります。",
            });
            ReactGA.event({
              category: "login",
              action: "error",
              label: inputValue.user_id,
            });
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  return (
    <>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
            <Grid container spacing={2} sx={{ p: 2 }}>
              <Grid item xs={12} sx={{ display: message.display }}>
                <Alert severity={message.severity}>{message.message}</Alert>
              </Grid>
              <Grid item xs={12}>
                {loading && <LinearProgress />}
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="user_id"
                  label="ユーザーID"
                  type="text"
                  onChange={(event) =>
                    updateValue({
                      user_id: event.target.value,
                      password: inputValue.password,
                    })
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="password"
                  label="パスワード"
                  type="password"
                  onChange={(event) =>
                    updateValue({
                      user_id: inputValue.user_id,
                      password: event.target.value,
                    })
                  }
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      login();
                    }
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={login}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      login();
                    }
                  }}
                  variant="outlined"
                  size="large"
                  startIcon={<LoginRoundedIcon />}
                >
                  ログイン
                </Button>
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
                「サーバーからの応答がありません」というエラーが発生した場合、サーバーが停止している可能性があります。時間をおいても表示が変わらない場合は技術部の担当者までお問い合わせください。
              </li>
              <li>
                ログイン状態は一定の時間が経過するとセッションが無効となり自動ログインが行われなくなります。ユーザーIDとパスワードを入力し、再度ログインしてください。
              </li>
            </ol>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
            <Typography variant="h2">このアプリのインストール方法</Typography>
            <ol>
              <li>
                Chromebookやパソコン・AndroidのGoogle
                Chromeを利用している場合、右上の <MoreVertIcon />{" "}
                から『「Gateway」をインストール』をクリック
              </li>
              <li>
                Safariを利用している場合 <IosShareIcon />{" "}
                から「ホーム画面に追加」をタップ
              </li>
              <li>
                ホーム画面に追加された「Gateway」というアイコンをタップして起動
              </li>
            </ol>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
