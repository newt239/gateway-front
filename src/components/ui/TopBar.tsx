import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '#/stores/index';

import { Container, Box, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import SettingsIcon from '@mui/icons-material/Settings';

const TopBar = () => {
    const navigate = useNavigate();
    const locationPath = useLocation().pathname;
    const pageProps = useSelector((state: RootState) => state.page);
    return (
        <AppBar position="fixed" elevation={0} sx={{ width: { xs: '100%', sm: `calc(100% - 240px)` } }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {locationPath !== "/login" && (
                        <Box sx={{ display: 'flex' }}>
                            <IconButton onClick={() => navigate(-1)}
                                size="large"
                                color="inherit"
                            >
                                <ArrowBackRoundedIcon />
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