import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '#/stores/index';

import { Grid, Typography } from '@mui/material';

import ExhibitScan from '#/components/ui/ExhibitScan';

const Exhibit: React.FunctionComponent<{ scanType: string; }> = ({ scanType }) => {
    const exhibit = useSelector((state: RootState) => state.exhibit);
    return (
        <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12}>
                <Typography variant='h3'>{exhibit.current.exhibit_name}</Typography>
            </Grid>
            <ExhibitScan scanType={scanType} />
        </Grid>
    );
};

export default Exhibit;