import React from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '#/stores/index';

import { Grid, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

export default function ChartAll() {
    const navigate = useNavigate();
    const exhibitList = useSelector((state: RootState) => state.exhibit).list;
    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} md={6}>
                <List dense={true}>
                    {exhibitList.map((exhibit) =>
                    (<ListItem key={exhibit.exhibit_id}>
                        <ListItemButton onClick={(e: any) => navigate(`/chart/exhibit/${exhibit.exhibit_id}`, { replace: true })}>
                            <ListItemText
                                primary={exhibit.exhibit_name}
                            />
                        </ListItemButton>
                    </ListItem>)
                    )}
                </List>
            </Grid>
        </Grid>
    );
}