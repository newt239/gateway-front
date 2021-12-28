import React, { useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../stores/index';
import { setTitle } from '../../stores/page';

import { Container, Box, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const TopBar = () => {
    const dispatch = useDispatch();
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
            default:
                dispatch(setTitle("unkwon page"));
        }
    }, [locationPath]);
    return (
        <AppBar position="fixed" sx={{ width: { xs: '100%', sm: `calc(100% - 240px)` } }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex' }}>
                        <IconButton
                            size="large"
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                    <Typography variant="h2" noWrap component="div">
                        {pageProps.title}
                    </Typography>
                    <Box sx={{ display: 'flex' }}>
                        <IconButton
                            size="large"
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default TopBar;