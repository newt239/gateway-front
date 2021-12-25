import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setToken } from '../../stores/auth';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import { TextField, Button, Typography } from '@mui/material';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

interface messageType {
    display: "none" | "block";
    severity: 'error' | 'success';
    message: string;
}

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [inputValue, updateValue] = useState({ username: "", password: "" });
    const [message, updateMessage] = useState<messageType>({ display: "none", severity: "error", message: "" });
    const login = () => {
        console.log("start");
        axios.post(API_BASE_URL + "/v1/auth/login", inputValue).then(res => {
            console.log(res);
            if (res.data.status === "success") {
                updateMessage({ display: "block", severity: "success", message: "ログインに成功しました。" });
                dispatch(setToken(res.data.token));
                navigate("/", { replace: true });
            } else {
                updateMessage({ display: "block", severity: "error", message: "パスワードが間違っています。" });
            }
        })
    }
    return (
        <Box>
            <Typography variant='h2'>ログイン</Typography>
            <Grid container spacing={2} columnSpacing={2}>
                <Grid item xs={12} sx={{ display: message.display }}>
                    <Alert severity={message.severity}>{message.message}</Alert>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="username"
                        label="ユーザー名"
                        type="text"
                        onChange={(event) => updateValue({ "username": event.target.value, "password": inputValue.password })}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="password"
                        label="パスワード"
                        type="password"
                        onChange={(event) => updateValue({ "username": inputValue.username, "password": event.target.value })}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={login} variant="outlined" size="large" startIcon={<LoginRoundedIcon />}>
                        ログイン
                    </Button>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Login;