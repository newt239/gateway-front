import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useRecoilState, useResetRecoilState, useRecoilRefresher_UNSTABLE } from "recoil";
import { tokenState, profileState } from "#/recoil/user";
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
    const [profileInfo, setProfileInfo] = useState({
        userid: '',
        display_name: '',
        user_type: '',
        role: '',
        available: false,
        note: '',
    });
    const [profile, setProfile] = useRecoilState(profileState);
    const resetProfile = useResetRecoilState(profileState);
    const refreshProfile = useRecoilRefresher_UNSTABLE(profileState);
    const [token, setToken] = useRecoilState(tokenState);
    const logout = () => {
        setToken("");
        resetProfile();
        localStorage.removeItem('gatewayApiToken');
        navigate("/login", { replace: true });
    };
    useEffect(() => {
        if (token) {
            const loginPost = async () => {
                const res = await axios.get(API_BASE_URL + "/v1/auth/me", { headers: { Authorization: "Bearer " + token } });
                //TODO: 初期ロード時recoilへのsetProfileによる更新が反映されないため暫定的にuseStateを使った更新で対応
                setProfile(res.data.data);
                setProfileInfo(res.data.data);
                console.log(res);
            };
            refreshProfile();
            loginPost();
        };
    }, [token]);
    const AccountType = () => {
        switch (profileInfo.user_type) {
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
                profileInfo.available ? (
                    <>
                        <Box sx={{ width: '100%', textAlign: 'right' }}>
                            <AccountType />
                        </Box>
                        <Identicon
                            size={40}
                            name={profileInfo.userid}
                            variant="beam"
                            colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                        />
                        <Typography variant='h3'>{profileInfo.display_name}</Typography>
                        <Typography sx={{ fontSize: 10 }}>@{profileInfo.userid}</Typography>
                        <Button variant="outlined" color="error" onClick={logout} sx={{ mt: 2 }} startIcon={<LogoutRoundedIcon />}>
                            ログアウト
                        </Button>
                    </>)
                    : (
                        <>
                            <Typography>ログインしていません</Typography>
                            <Button variant="outlined" color="success" onClick={e => navigate("/login", { replace: true })} sx={{ mt: 2 }} startIcon={<LogoutRoundedIcon />}>
                                ログイン
                            </Button>
                        </>
                    )
            }
        </>
    );
}

export default UserInfo;