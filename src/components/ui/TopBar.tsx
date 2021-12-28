import React, { useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../stores/index';
import { setTitle } from '../../stores/page';

import { Container, Box, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import SettingsIcon from '@mui/icons-material/Settings';

import allPageProps from '../functional/pageProps';

interface pagePropsObject {
    path: string;
    title: string;
    description: string;
}

const TopBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const locationPath = useLocation().pathname;
    const pageProps = useSelector((state: RootState) => state.page);
    useEffect(() => {
        const props = allPageProps.find((e: pagePropsObject) => e.path === locationPath);
        if (props) {
            dispatch(setTitle(props.title));
        } else {
            dispatch(setTitle("unknown page"));
        };
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