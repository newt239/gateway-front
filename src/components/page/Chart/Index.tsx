import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Apexchart from './Chart';


export default function Chart() {
    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h2">統計</Typography>
            <Apexchart />
        </Box>
    );
}