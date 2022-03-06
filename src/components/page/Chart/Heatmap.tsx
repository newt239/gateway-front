import React, { useEffect } from 'react';
import { useSetRecoilState } from "recoil";
import { pageStateSelector } from '#/recoil/page';

import { Grid } from '@mui/material';


export default function Heatmap() {
    const setPageInfo = useSetRecoilState(pageStateSelector);
    useEffect(() => {
        setPageInfo({ title: "ヒートマップ" });
    }, []);

    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} md={6}>
            </Grid>
        </Grid>
    );
}