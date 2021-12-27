import React, { useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../stores/index';
import { setTitle } from '../../stores/page';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

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
            default:
                dispatch(setTitle("unkwon page"));
        }
    }, [locationPath]);
    return (
        <AppBar position="fixed" sx={{ width: { xs: '100%', sm: `calc(100% - 240px)` } }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                    <Typography
                        variant="h2"
                        noWrap
                        component="div"
                        sx={{ display: 'flex' }}
                    >
                        {pageProps.title}
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default TopBar;