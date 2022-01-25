import React from 'react';
import { Grid } from '@mui/material';

import ExhibitEnterCountBarChart from './Chart';


export default function Chart() {
    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} md={6}>
                <ExhibitEnterCountBarChart />
            </Grid>
        </Grid>
    );
}