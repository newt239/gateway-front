import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../stores/index'
import { clearToken } from '../../stores/auth';

import Box from '@mui/material/Box';
import { Button, Typography } from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;
const UserInfo = () => {
    const [userProfile, updateUserProfile] = useState("unknown");
    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.auth.token);
    const logout = () => {
        dispatch(clearToken());
    }
    useEffect(() => {
        axios.get(API_BASE_URL + "/v1/users/me", { headers: { Authorization: "Bearer " + token } }).then(res => {
            console.log(res.data);
            updateUserProfile(res.data.username);
        })
    }, [token]);
    return (
        <Box sx={{ p: 2 }}>
            <Typography sx={{ fontSize: 20, fontWeight: 800 }}>{userProfile}</Typography>
            <Typography sx={{ fontSize: 10 }}>@{userProfile}</Typography>
            <Button variant="outlined" color="error" onClick={logout} sx={{ mt: 2 }} startIcon={<LogoutRoundedIcon />}>
                ログアウト
            </Button>
        </Box>
    )
}

export default UserInfo;