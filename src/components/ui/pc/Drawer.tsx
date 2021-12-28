import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Drawer, Toolbar, List, Divider, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import AutoGraphRoundedIcon from '@mui/icons-material/AutoGraphRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';

import UserInfo from '../UserInfo';
const drawerWidth = 240;

const DrawerLeft = () => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const path = useLocation().pathname;
    const navigate = useNavigate();
    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
        path: string
    ) => {
        navigate(`${path}`);
        setSelectedIndex(index);
    };
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
                    onClick={(event) => handleListItemClick(event, 0, '')}>
                    <ListItemIcon><HomeRoundedIcon /></ListItemIcon>
                    <ListItemText primary='ホーム' />
                </ListItemButton>
                <ListItemButton selected={/operate/.test(path)}
                    onClick={(event) => handleListItemClick(event, 1, 'operate')}>
                    <ListItemIcon><MeetingRoomRoundedIcon /></ListItemIcon>
                    <ListItemText primary='入退室処理' />
                </ListItemButton>
                <ListItemButton selected={/chart/.test(path)}
                    onClick={(event) => handleListItemClick(event, 2, 'chart')}>
                    <ListItemIcon><AutoGraphRoundedIcon /></ListItemIcon>
                    <ListItemText primary='統計' />
                </ListItemButton>
                <ListItemButton selected={/crowd/.test(path)}
                    onClick={(event) => handleListItemClick(event, 3, 'crowd')}>
                    <ListItemIcon><MapRoundedIcon /></ListItemIcon>
                    <ListItemText primary='混雑状況' />
                </ListItemButton>
            </List>
            <Divider />
        </Drawer>
    );
}

export default DrawerLeft;