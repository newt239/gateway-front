import React, { useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';


const SimpleBottomNavigation = () => {
    const path = useLocation().pathname;
    const [value, setValue] = React.useState("other");
    const navigate = useNavigate();
    useEffect(() => {
        if (path === '/') {
            setValue('');
        } else if (/operate/.test(path)) {
            setValue('operate');
        } else {
            setValue("other");
        }
    }, [path]);
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