import * as React from 'react';
import { useNavigate } from "react-router-dom";
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { Container, Box } from '@mui/material';
import Paper from '@mui/material/Paper';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';

import Body from '../../page/Body';

const SimpleBottomNavigation = () => {
    const [value, setValue] = React.useState("");
    const navigate = useNavigate();
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        navigate(`${newValue}`);
        setValue(newValue);
    };
    return (
        <>
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={handleChange}
                >
                    <BottomNavigationAction label="ホーム" value="" icon={<HomeRoundedIcon />} />
                    <BottomNavigationAction label="入退室処理" value="operate" icon={<MeetingRoomRoundedIcon />} />
                </BottomNavigation>
            </Paper>
        </>
    );
}

export default SimpleBottomNavigation;