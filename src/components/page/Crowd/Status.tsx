import React from 'react';
import { Grid, Card } from '@mui/material';

import Current from '#/components/page/Crowd/Current';


export default function Heatmap() {
    return (
        <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12}>
                <Card variant="outlined" sx={{ p: 2 }}>
                    <Current />
                </Card>
            </Grid>
        </Grid>
    );
}