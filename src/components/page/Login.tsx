import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { tokenState, profileState } from "#/recoil/user";
import { pageStateSelector } from "#/recoil/page";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";

import { Grid, Alert, TextField, Button } from "@mui/material";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";

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
  const [inputValue, updateValue] = useState({ user_id: "", password: "" });
  const [message, updateMessage] = useState<messageType>({
    display: "none",
    severity: "error",
    message: "",
  });
  const login = () => {
    if (inputValue.user_id !== "") {
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
          console.log(err);
          updateMessage({
            display: "block",
            severity: "error",
            message:
              "エラーが発生しました。ユーザーidまたはパスワードが間違っている可能性があります。",
          });
        });
    }
  };
  return (
    <>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12} sx={{ display: message.display }}>
          <Alert severity={message.severity}>{message.message}</Alert>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="user_id"
            label="ユーザーid"
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
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={login}
            variant="outlined"
            size="large"
            startIcon={<LoginRoundedIcon />}
          >
            ログイン
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
