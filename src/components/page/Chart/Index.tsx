import * as React from 'react';
import { Paper, Typography } from '@mui/material';

import Apexchart from './Chart';


export default function Chart() {
    return (
        <>
            <Paper elevation={3} sx={{ width: '100%', overflowX: 'scroll' }}>
                <Apexchart />
            </Paper>
        </>
    );
}