import React from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Paper, Box, Typography, Button } from '@mui/material';

import SelectPlace from '../../ui/SelectPlace';

const Home = () => {
    const navigate = useNavigate();
    return (
        <>
            <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12} md={6} lg={4}>
                    <Paper elevation={3} sx={{ width: '100%' }}>
                        <Box sx={{ p: 2 }}>
                            <Typography variant="h3">入場処理</Typography>
                            <Typography>リストバンドと予約情報のデータの連携を行います。</Typography>
                            <Box sx={{ width: '100%', textAlign: 'right' }}>
                                <Button onClick={() => navigate("reserve-check")} variant='outlined'>開く</Button>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <Paper elevation={3} sx={{ width: '100%' }}>
                        <Box sx={{ p: 2 }}>
                            <Typography variant="h3">退場処理</Typography>
                            <Typography>退場を記録します。</Typography>
                            <Box sx={{ width: '100%', textAlign: 'right' }}>
                                <Button onClick={() => navigate("exit")} variant='outlined'>開く</Button>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            <SelectPlace />
        </>
    )
}

export default Home;