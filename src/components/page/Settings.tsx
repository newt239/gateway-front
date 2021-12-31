import React, { useEffect } from "react";

import { Grid, Card, Typography } from '@mui/material';

import UserInfo from '../ui/UserInfo';

const Settings = () => {
    return (
        <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography>settings</Typography>
                </Card>
            </Grid>
        </Grid>
    )
}

export default Settings;