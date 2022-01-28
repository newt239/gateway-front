import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '#/stores/index';
import axios from 'axios';

import { Grid, Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ゲストID' },
    { field: 'guest_type', headerName: 'ゲストタイプ', width: 120 },
    { field: 'enter_at', headerName: '入室時刻', width: 200 },
];

const ExhibitCurrentGuestList: React.FunctionComponent<{ exhibit_id: string; }> = ({ exhibit_id }) => {
    const [rows, setRows] = useState([]);
    const token = useSelector((state: RootState) => state.user).token;

    useEffect(() => {
        if (exhibit_id !== "") {
            axios.get(`${API_BASE_URL}/v1/exhibit/current/${exhibit_id}`, { headers: { Authorization: "Bearer " + token } }).then(res => {
                console.log(res);
                if (res.data) {
                    setRows(res.data.data);
                };
            });
        };
    }, [exhibit_id]);
    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12}>
                <Box sx={{ height: '70vh', width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[10]}
                        checkboxSelection
                    />
                </Box>
            </Grid>
        </Grid >
    );
};

export default ExhibitCurrentGuestList;