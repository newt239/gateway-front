import React, { Suspense } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { profileState } from "#/recoil/user";
import { Drawer, Box, Toolbar, List, ListSubheader, Divider, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded';
import TableChartRoundedIcon from '@mui/icons-material/TableChartRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import AppSettingsAltRoundedIcon from '@mui/icons-material/AppSettingsAltRounded';

import UserInfo from '#/components/block/UserInfo';

const drawerWidth = 240;

const DrawerLeft = () => {
    const path = useLocation().pathname;
    const navigate = useNavigate();
    const profile = useRecoilValue(profileState);

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar>
                <Typography variant="h1">Gateway</Typography>
            </Toolbar>
            <Divider />
            <Box sx={{ p: 2 }}>
                <Suspense fallback={<p>hey</p>}>
                    <UserInfo />
                </Suspense>
            </Box>
            {profile && profile.available && (
                <>
                    <Divider />
                    <List>
                        <ListItemButton selected={path === '/'}
                            onClick={() => navigate('/')}>
                            <ListItemIcon><HomeRoundedIcon /></ListItemIcon>
                            <ListItemText primary='ホーム' />
                        </ListItemButton>
                    </List>
                    {["admin", "moderator", "exhibit"].indexOf(profile.user_type, -1) && (
                        <>
                            <Divider />
                            <List subheader={<ListSubheader>展示企画</ListSubheader>}>
                                <ListItemButton selected={/exhibit\/enter/.test(path)}
                                    onClick={() => navigate('/exhibit/enter')}>
                                    <ListItemIcon><LoginRoundedIcon /></ListItemIcon>
                                    <ListItemText primary='入室スキャン' />
                                </ListItemButton>
                                <ListItemButton selected={/exhibit\/exit/.test(path)}
                                    onClick={() => navigate('/exhibit/exit')}>
                                    <ListItemIcon><LogoutRoundedIcon /></ListItemIcon>
                                    <ListItemText primary='退室スキャン' />
                                </ListItemButton>
                                <ListItemButton selected={/exhibit\/pass/.test(path)}
                                    onClick={() => navigate('/exhibit/pass')}>
                                    <ListItemIcon><ArrowRightAltRoundedIcon /></ListItemIcon>
                                    <ListItemText primary='通過スキャン' />
                                </ListItemButton>
                            </List>
                        </>
                    )}
                    {["admin", "moderator", "user"].indexOf(profile.user_type, -1) && (
                        <>
                            <Divider />
                            <List subheader={<ListSubheader>エントランス</ListSubheader>}>
                                <ListItemButton selected={/entrance\/reserve-check/.test(path)}
                                    onClick={() => navigate('/entrance/reserve-check')}>
                                    <ListItemIcon><LoginRoundedIcon /></ListItemIcon>
                                    <ListItemText primary='入場スキャン' />
                                </ListItemButton>
                                <ListItemButton selected={/entrance\/exit/.test(path)}
                                    onClick={() => navigate('/entrance/exit')}>
                                    <ListItemIcon><LogoutRoundedIcon /></ListItemIcon>
                                    <ListItemText primary='退場スキャン' />
                                </ListItemButton>
                            </List>
                            <Divider />
                            <List subheader={<ListSubheader>混雑状況</ListSubheader>}>
                                <ListItemButton selected={/chart\/all/.test(path)}
                                    onClick={() => navigate('/chart/all')}>
                                    <ListItemIcon><TableChartRoundedIcon /></ListItemIcon>
                                    <ListItemText primary='全体の滞在状況' />
                                </ListItemButton>
                                <ListItemButton selected={/chart\/heatmap/.test(path)}
                                    onClick={() => navigate('/chart/heatmap')}>
                                    <ListItemIcon><MapRoundedIcon /></ListItemIcon>
                                    <ListItemText primary='ヒートマップ' />
                                </ListItemButton>
                            </List>
                        </>
                    )}
                    {["admin", "moderator"].indexOf(profile.user_type, -1) && (
                        <>
                            <Divider />
                            <List subheader={<ListSubheader>管理者用</ListSubheader>}>
                                <ListItemButton selected={/admin\//.test(path)}
                                    onClick={() => navigate('/admin/')}>
                                    <ListItemIcon><AppSettingsAltRoundedIcon /></ListItemIcon>
                                    <ListItemText primary='コンソール' />
                                </ListItemButton>
                            </List>
                        </>
                    )}
                </>
            )}
        </Drawer >
    );
};

export default DrawerLeft;