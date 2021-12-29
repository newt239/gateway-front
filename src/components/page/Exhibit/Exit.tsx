import React from 'react';
import { Grid, Typography } from '@mui/material';

import ExhibitScan from '../../ui/ExhibitScan';

export default function ExhibitExit() {
    return (
        <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12}>
                <Typography variant='h3'>退室を記録するリストバンドのQRコードをかざしてください</Typography>
            </Grid>
            <ExhibitScan scanType="exit" />
        </Grid>
    );
}