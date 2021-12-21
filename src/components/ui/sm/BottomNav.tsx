import * as React from 'react';
import { useNavigate } from "react-router-dom";
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';

import Body from '../../page/Body';

const SimpleBottomNavigation = () => {
    const [value, setValue] = React.useState("");
    const navigate = useNavigate();
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        navigate(`${newValue}`);
        setValue(newValue);
    };
    return (
        <div>
            <Box>
                <Body />
            </Box>
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={handleChange}
                >
                    <BottomNavigationAction label="Home" value="" icon={<RestoreIcon />} />
                    <BottomNavigationAction label="Operate" value="operate" icon={<FavoriteIcon />} />
                </BottomNavigation>
            </Paper>
        </div>
    );
}

export default SimpleBottomNavigation;