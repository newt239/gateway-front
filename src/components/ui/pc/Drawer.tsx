import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Drawer, Toolbar, List, Divider, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import UserInfo from '../UserInfo';
const drawerWidth = 240;

const DrawerLeft = () => {
    const path = useLocation().pathname;
    const navigate = useNavigate();
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
                <Typography variant="h1" sx={{ color: 'primary.main' }}>Gateway</Typography>
            </Toolbar>
            <Divider />
            <UserInfo />
            <Divider />
            <List>
                <ListItemButton selected={path === '/'}
                    onClick={() => navigate('/')}>
                    <ListItemIcon><HomeRoundedIcon /></ListItemIcon>
                    <ListItemText primary='ホーム' />
                </ListItemButton>
                <ListItemButton selected={/operate/.test(path)}
                    onClick={() => navigate('/operate')}>
                    <ListItemIcon><MeetingRoomRoundedIcon /></ListItemIcon>
                    <ListItemText primary='入退室処理' />
                </ListItemButton>
                <ListItemButton selected={/crowd/.test(path)}
                    onClick={() => navigate('/crowd')}>
                    <ListItemIcon><MapRoundedIcon /></ListItemIcon>
                    <ListItemText primary='混雑状況' />
                </ListItemButton>
            </List>
            <Divider />
            <List>
                <ListItemButton selected={/entrance\/reserve-check/.test(path)}
                    onClick={() => navigate('/entrance/reserve-check')}>
                    <ListItemIcon><LoginRoundedIcon /></ListItemIcon>
                    <ListItemText primary='入場処理' />
                </ListItemButton>
                <ListItemButton selected={/entrance\/exit/.test(path)}
                    onClick={() => navigate('/entrance/exit')}>
                    <ListItemIcon><LogoutRoundedIcon /></ListItemIcon>
                    <ListItemText primary='退場処理' />
                </ListItemButton>
            </List>
        </Drawer>
    );
}

export default DrawerLeft;