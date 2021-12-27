import React, { useEffect } from "react";

import { Grid, Paper, Typography } from '@mui/material';

import UserInfo from '../ui/UserInfo';

const Home = () => {
    return (
        <>
            <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ width: '100%' }}>
                        <UserInfo />
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}

export default Home;