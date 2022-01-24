import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '#/stores/index';
import { setPageInfo } from '#/stores/page';
import axios from 'axios';

import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import SelectExhibit from '#/components/block/SelectExhibit';

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ゲストID', width: 200 },
    { field: 'guest_type', headerName: 'ゲストタイプ', width: 200 },
    { field: 'enter_at', headerName: '入室時刻', width: 200 },
];

export default function Current() {
    const dispatch = useDispatch();
    const [rows, setRows] = useState([]);
    const token = useSelector((state: RootState) => state.user).token;
    const exhibit = useSelector((state: RootState) => state.exhibit);

    useEffect(() => {
        dispatch(setPageInfo({ title: "現在の混雑状況" }));
    }, []);

    useEffect(() => {
        if (exhibit.current.exhibit_id !== "") {
            axios.get(`${API_BASE_URL}/v1/exhibit/current/${exhibit.current.exhibit_id}`, { headers: { Authorization: "Bearer " + token } }).then(res => {
                console.log(res);
                if (res.data) {
                    setRows(res.data.data);
                };
            });
        }
    }, [exhibit]);
    return (
        <>
            <SelectExhibit />
            <Box sx={{ height: '70vh', width: '100%' }}>
                {exhibit && (
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                    />
                )}
            </Box>
        </>
    );
}