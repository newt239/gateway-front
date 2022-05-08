import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { tokenState, profileState } from "#/recoil/user";
import { pageStateSelector } from '#/recoil/page';
import axios, { AxiosResponse } from 'axios';

import { Grid, Alert, TextField, Button } from '@mui/material';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';

import { loginSuccessProp } from "#/types/auth";

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

interface messageType {
  display: 'none' | 'block';
  severity: 'error' | 'success';
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
  const [inputValue, updateValue] = useState({ userId: "", password: "" });
  const [message, updateMessage] = useState<messageType>({ display: "none", severity: "error", message: "" });
  const login = async () => {
    if (inputValue.userId !== "") {
      const res: AxiosResponse<loginSuccessProp> = await axios.post(API_BASE_URL + "/v1/auth/login", inputValue);
      if (res.data.status === "success") {
        updateMessage({ display: "block", severity: "success", message: "ログインに成功しました。" });
        localStorage.setItem('gatewayApiToken', res.data.token);
        setToken(res.data.token)
        setProfile(res.data.profile)
        navigate("/", { replace: true })
      } else {
        updateMessage({ display: "block", severity: "error", message: "ユーザーidまたはパスワードが間違っています。" });
      }
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
            id="userId"
            label="ユーザーid"
            type="text"
            onChange={(event) => updateValue({ "userId": event.target.value, "password": inputValue.password })}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="password"
            label="パスワード"
            type="password"
            onChange={(event) => updateValue({ "userId": inputValue.userId, "password": event.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button onClick={login} variant="outlined" size="large" startIcon={<LoginRoundedIcon />}>
            ログイン
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;