import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../stores/index';
import { updateCurrentExhibit } from '../../../stores/exhibit';
import axios from 'axios';
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ゲストID', width: 70 },
    { field: 'guest_type', headerName: 'ゲストタイプ', width: 130 },
];

export default function Current() {
    const [rows, setRows] = useState([{ id: 1, guest_type: 'Snow' }]);
    const token = useSelector((state: RootState) => state.auth.token);
    const exhibit = useSelector((state: RootState) => state.exhibit);
    useEffect(() => {
        axios.get(`${API_BASE_URL}/v1/exhibit/current/${exhibit.list[exhibit.current].exhibit_id}`, { headers: { Authorization: "Bearer " + token } }).then(res => {
            console.log(res);
            if (res.data) {
                setRows(res.data.data);
            };
        });
    }, []);
    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
            />
        </Box>
    );
}