import * as React from 'react';
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import AutoGraphRoundedIcon from '@mui/icons-material/AutoGraphRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';

import Body from '../../page/Body';
const drawerWidth = 240;

const DrawerLeft = () => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
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
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
            >
                <Toolbar>
                    <Typography variant="h1" noWrap component="div">
                        Gateway
                    </Typography>
                </Toolbar>
            </AppBar>
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
                <Toolbar />
                <Divider />
                <List>
                    <ListItemButton selected={selectedIndex === 0}
                        onClick={(event) => handleListItemClick(event, 0, '')}>
                        <ListItemIcon><HomeRoundedIcon /></ListItemIcon>
                        <ListItemText primary='ホーム' />
                    </ListItemButton>
                    <ListItemButton selected={selectedIndex === 1}
                        onClick={(event) => handleListItemClick(event, 1, 'operate')}>
                        <ListItemIcon><MeetingRoomRoundedIcon /></ListItemIcon>
                        <ListItemText primary='入退室処理' />
                    </ListItemButton>
                    <ListItemButton selected={selectedIndex === 2}
                        onClick={(event) => handleListItemClick(event, 2, 'chart')}>
                        <ListItemIcon><AutoGraphRoundedIcon /></ListItemIcon>
                        <ListItemText primary='統計' />
                    </ListItemButton>
                    <ListItemButton selected={selectedIndex === 3}
                        onClick={(event) => handleListItemClick(event, 3, 'crowd')}>
                        <ListItemIcon><MapRoundedIcon /></ListItemIcon>
                        <ListItemText primary='混雑状況' />
                    </ListItemButton>
                    <ListItemButton selected={selectedIndex === 4}
                        onClick={(event) => handleListItemClick(event, 4, 'history')}>
                        <ListItemIcon><HistoryRoundedIcon /></ListItemIcon>
                        <ListItemText primary='履歴' />
                    </ListItemButton>

                </List>
                <Divider />
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            >
                <Toolbar />
                <Body />
            </Box>
        </Box>
    );
}

export default DrawerLeft;