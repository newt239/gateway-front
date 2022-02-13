import React, { useState, useEffect } from "react";
import moment, { Moment } from "moment";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setPageInfo } from '#/stores/page';

import { Grid, Card, Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import UserInfo from '#/components/block/UserInfo';

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const sm = useMediaQuery(theme.breakpoints.up('sm'));
    const [datetime, setDatetime] = useState<Moment>(moment());

    useEffect(() => {
        dispatch(setPageInfo({ title: "ホーム" }));
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDatetime(moment());
        }, 60 * 1000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);
    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} md={6} lg={4}>
                <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
                    <UserInfo />
                </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
                    <Typography variant="h3">
                        {datetime.format('M月D日 H時m分')}
                    </Typography>
                    <Typography variant="body2">次の時間枠まであと{ }分</Typography>
                </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
                    <Typography variant="h3">
                        校内滞在者数
                    </Typography>
                    <Typography variant="body2">ここに人数とか棒グラフとか</Typography>
                    <Box sx={{ width: '100%', textAlign: 'right' }}>
                        <Button onClick={() => navigate("crowd")} variant="outlined">
                            詳細
                        </Button>
                    </Box>
                </Card>
            </Grid>
        </Grid >
    )
}

export default Home;