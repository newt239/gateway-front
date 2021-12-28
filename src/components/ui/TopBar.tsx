import React, { useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../stores/index';
import { setTitle } from '../../stores/page';

import { Container, Box, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import SettingsIcon from '@mui/icons-material/Settings';

const TopBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const locationPath = useLocation().pathname;
    const pageProps = useSelector((state: RootState) => state.page);
    useEffect(() => {
        switch (locationPath) {
            case "/":
                dispatch(setTitle("ホーム"));
                break;
            case "/operate":
                dispatch(setTitle("入退室処理"));
                break;
            case "/operate/enter":
                dispatch(setTitle("入室処理"));
                break;
            case "/operate/exit":
                dispatch(setTitle("退室処理"));
                break;
            case "/operate/pass":
                dispatch(setTitle("通過処理"));
                break;
            case "/login":
                dispatch(setTitle("ログイン"));
                break;
            case "/chart":
                dispatch(setTitle("統計"));
                break;
            case "/crowd":
                dispatch(setTitle("混雑状況"));
                break;
            case "settings":
                dispatch(setTitle("設定"));
                break;
            default:
                dispatch(setTitle("unkwon page"));
        }
    }, [locationPath]);
    const backPreviousPage = () => {
        navigate(-1);
    };
    return (
        <AppBar position="fixed" sx={{ width: { xs: '100%', sm: `calc(100% - 240px)` } }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {locationPath !== "/login" && (
                        <Box sx={{ display: 'flex' }}>
                            <IconButton onClick={backPreviousPage}
                                size="large"
                                color="inherit"
                            >
                                <ArrowBackIosNewRoundedIcon />
                            </IconButton>
                        </Box>)}
                    <Typography variant="h2" noWrap>
                        {pageProps.title}
                    </Typography>
                    {locationPath !== "/login" && (
                        <Box sx={{ display: 'flex' }}>
                            <IconButton onClick={() => navigate('settings', { replace: true })}
                                size="large"
                                color="inherit"
                            >
                                <SettingsIcon />
                            </IconButton>
                        </Box>)}
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default TopBar;