import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { tokenState } from "#/recoil/user";
import { pageStateSelector } from '#/recoil/page';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { Grid, Alert, TextField, Button } from '@mui/material';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

interface messageType {
    display: "none" | "block";
    severity: 'error' | 'success';
    message: string;
}

const Login = () => {
    const setToken = useSetRecoilState(tokenState);
    const dispatch = useDispatch();
    const setPageInfo = useSetRecoilState(pageStateSelector);
    useEffect(() => {
        setPageInfo({ title: "ログイン" });
    }, []);
    const navigate = useNavigate();
    const [inputValue, updateValue] = useState({ userid: "", password: "" });
    const [message, updateMessage] = useState<messageType>({ display: "none", severity: "error", message: "" });
    const login = () => {
        if (inputValue.userid !== "") {
            axios.post(API_BASE_URL + "/v1/auth/login", inputValue).then(res => {
                if (res.data.status === "success") {
                    updateMessage({ display: "block", severity: "success", message: "ログインに成功しました。" });
                    localStorage.setItem('gatewayApiToken', res.data.token);
                    setToken(res.data.token);
                    navigate("/", { replace: true });
                } else {
                    updateMessage({ display: "block", severity: "error", message: "ユーザーidまたはパスワードが間違っています。" });
                };
            });
        };
    };
    return (
        <>
            <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={12} sx={{ display: message.display }}>
                    <Alert severity={message.severity}>{message.message}</Alert>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        id="userid"
                        label="ユーザーid"
                        type="text"
                        onChange={(event) => updateValue({ "userid": event.target.value, "password": inputValue.password })}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        id="password"
                        label="パスワード"
                        type="password"
                        onChange={(event) => updateValue({ "userid": inputValue.userid, "password": event.target.value })}
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
    )
}

export default Login;