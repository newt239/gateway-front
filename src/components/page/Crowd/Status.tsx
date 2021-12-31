import * as React from 'react';
import { Grid, Card, Typography } from '@mui/material';

import Current from './Current';


export default function Heatmap() {
    return (
        <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} md={6}>
                <Card>
                    <Current />
                </Card>
            </Grid>
        </Grid>
    );
}