import * as React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

import Apexchart from './Chart';


export default function Status() {
    return (
        <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} md={6}>
                <Apexchart />
            </Grid>
        </Grid>
    );
}