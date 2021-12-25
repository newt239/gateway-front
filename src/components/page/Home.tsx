import React from "react";

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import UserInfo from '../ui/UserInfo';

const Home = () => {
    return (
        <Box>
            <Typography variant="h2">ホーム</Typography>
            <UserInfo />
        </Box>
    )
}

export default Home;