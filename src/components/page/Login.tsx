import React from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setToken } from '../../stores/auth';
import { TextField, Button } from '@mui/material';
const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [inputValue, updateValue] = React.useState({ username: "", password: "" });
    const login = () => {
        console.log("start");
        axios.post(API_BASE_URL + "/v1/auth/login", inputValue).then(res => {
            console.log(res);
            if (res.data.status === "success") {
                dispatch(setToken(res.data.token));
                console.log("success");
                navigate("/", { replace: true });
            }
        })
    }
    return (
        <div>
            <form className="form">
                <TextField
                    id="username"
                    label="ユーザー名"
                    type="text"
                    onChange={(event) => updateValue({ "username": event.target.value, "password": inputValue.password })}
                />
                <TextField
                    id="password"
                    label="パスワード"
                    type="password"
                    onChange={(event) => updateValue({ "username": inputValue.username, "password": event.target.value })}
                />
                <Button color="primary" onClick={login}>
                    ログイン
                </Button>
            </form>
        </div>
    )
}

export default Login;