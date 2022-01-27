import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { setPageInfo } from '#/stores/page';

import { Grid } from '@mui/material';


export default function Heatmap() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageInfo({ title: "ヒートマップ" }));
    }, []);

    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} md={6}>
            </Grid>
        </Grid>
    );
}