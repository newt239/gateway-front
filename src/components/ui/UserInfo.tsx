import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../stores/index';
import { clearToken } from '../../stores/auth';
import { setProfile } from '../../stores/user';

import Box from '@mui/material/Box';
import { Button, Typography } from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupIcon from '@mui/icons-material/Group';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;
const UserInfo = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.auth.token);
    const userProfile = useSelector((state: RootState) => state.user);
    const logout = () => {
        dispatch(clearToken());
        localStorage.removeItem('gatewayApiToken');
        navigate("/login", { replace: true });
    };
    useEffect(() => {
        if (token) {
            axios.get(API_BASE_URL + "/v1/auth/me", { headers: { Authorization: "Bearer " + token } }).then(res => {
                console.log(res);
                if (res.data) {
                    dispatch(setProfile(res.data.data));
                };
            });
        };
    }, [token]);
    const AccountIcon = () => {
        switch (userProfile.user_type) {
            case "admin":
                return <AdminPanelSettingsIcon />;
            case "moderator":
                return <ManageAccountsIcon />;
            case "user":
                return <AccountCircleIcon />;
            case "group":
                return <GroupIcon />;
            default:
                return <NoAccountsIcon />;
        };
    };
    return (
        <Box>
            {userProfile.available && (
                <Box sx={{ p: 2 }}>
                    <AccountIcon />
                    <Typography variant='h3'>{userProfile.display_name}</Typography>
                    <Typography sx={{ fontSize: 10 }}>@{userProfile.userid}</Typography>
                    <Button variant="outlined" color="error" onClick={logout} sx={{ mt: 2 }} startIcon={<LogoutRoundedIcon />}>
                        ログアウト
                    </Button>
                </Box>)}
        </Box>
    );
}

export default UserInfo;