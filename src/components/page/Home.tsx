import React from "react";

import { Grid, Card } from '@mui/material';

import UserInfo from '#/components/ui/UserInfo';

const Home = () => {
    return (
        <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} md={6} lg={4}>
                <Card variant="outlined" sx={{ p: 2 }}>
                    <UserInfo />
                </Card>
            </Grid>
        </Grid>
    )
}

export default Home;