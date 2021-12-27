import React from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Paper, Box, Typography, Button } from '@mui/material';


const Home = () => {
    const navigate = useNavigate();
    return (
        <>
            <Typography variant="h2">入退室処理</Typography>
            <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ width: '100%' }}>
                        <Box sx={{ p: 2 }}>
                            <Typography variant="h4">入室処理</Typography>
                            <Typography>入室処理</Typography>
                            <Button onClick={() => navigate("enter")}>開く</Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}

export default Home;