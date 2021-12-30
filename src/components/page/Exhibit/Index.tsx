import React from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Paper, Box, Typography, Button } from '@mui/material';

const Home = () => {
    const navigate = useNavigate();
    return (
        <>
            <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12} md={6} lg={4}>
                    <Paper elevation={3} sx={{ width: '100%' }}>
                        <Box sx={{ p: 2 }}>
                            <Typography variant="h3">入室処理</Typography>
                            <Typography>展示への入室を記録します。</Typography>
                            <Box sx={{ width: '100%', textAlign: 'right' }}>
                                <Button onClick={() => navigate("enter")} variant='outlined'>開く</Button>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <Paper elevation={3} sx={{ width: '100%' }}>
                        <Box sx={{ p: 2 }}>
                            <Typography variant="h3">退室処理</Typography>
                            <Typography>展示からの退室を記録します。</Typography>
                            <Box sx={{ width: '100%', textAlign: 'right' }}>
                                <Button onClick={() => navigate("exit")} variant='outlined'>開く</Button>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <Paper elevation={3} sx={{ width: '100%' }}>
                        <Box sx={{ p: 2 }}>
                            <Typography variant="h3">通過処理</Typography>
                            <Typography>展示の通過を記録します。</Typography>
                            <Box sx={{ width: '100%', textAlign: 'right' }}>
                                <Button onClick={() => navigate("pass")} variant='outlined'>開く</Button>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}

export default Home;