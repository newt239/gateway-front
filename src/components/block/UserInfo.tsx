import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { tokenState, profileState, userState } from "#/recoil/user";
import Identicon from "boring-avatars";

import { Button, Box, Typography } from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupIcon from '@mui/icons-material/Group';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;
const UserInfo = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useRecoilState(profileState);
    const [token, setToken] = useRecoilState(tokenState);
    const logout = () => {
        setToken("");
        localStorage.removeItem('gatewayApiToken');
        navigate("/login", { replace: true });
    };
    useEffect(() => {
        if (token) {
            axios.get(API_BASE_URL + "/v1/auth/me", { headers: { Authorization: "Bearer " + token } }).then(res => {
                console.log(res);
                if (res.data) {
                    setProfile(res.data.data);
                }
            });
        };
    }, [token]);
    const AccountType = () => {
        switch (profile.user_type) {
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
        <>
            {
                profile.available ? (
                    <>
                        <Box sx={{ width: '100%', textAlign: 'right' }}>
                            <AccountType />
                        </Box>
                        <Identicon
                            size={40}
                            name={profile.userid}
                            variant="beam"
                            colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                        />
                        <Typography variant='h3'>{profile.display_name}</Typography>
                        <Typography sx={{ fontSize: 10 }}>@{profile.userid}</Typography>
                        <Button variant="outlined" color="error" onClick={logout} sx={{ mt: 2 }} startIcon={<LogoutRoundedIcon />}>
                            ログアウト
                        </Button>
                    </>)
                    : (
                        <Typography>ログインしていません</Typography>
                    )
            }
        </>
    );
}

export default UserInfo;