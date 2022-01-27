import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { setPageInfo } from '#/stores/page';

import { Grid, Card, Typography } from '@mui/material';

const Docs = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageInfo({ title: "設定" }));
    }, []);
    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography>settings</Typography>
                </Card>
            </Grid>
        </Grid>
    )
}

export default Docs;