import React, { useState, useEffect } from 'react';
import { useRecoilValue } from "recoil";
import { tokenState } from "#/recoil/user";
import axios, { AxiosResponse } from 'axios';
import moment from "moment";

import { Grid, Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import generalProps, { exhibitCurrentGuestProp } from "#/components/functional/generalProps";
import { currentEachExhibitSuccessProp } from '#/types/exhibit';

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ゲストID' },
  { field: 'guest_type', headerName: '属性' },
  { field: 'enter_at', headerName: '入室時刻', width: 200 },
];

type exhibitCurrentGuestTableListProp = {
  id: string;
  guest_type: string;
  enter_at: string;
}[]

const ExhibitCurrentGuestList: React.FunctionComponent<{ exhibit_id: string; }> = ({ exhibit_id }) => {
  const [rows, setRows] = useState<exhibitCurrentGuestTableListProp>([]);
  const token = useRecoilValue(tokenState);

  useEffect(() => {
    if (token && exhibit_id !== "") {
      axios.get(`${API_BASE_URL}/v1/exhibit/current/${exhibit_id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res: AxiosResponse<currentEachExhibitSuccessProp>) => {
          const tableData = res.data.data.map((e: exhibitCurrentGuestProp) => ({
            id: e.id,
            guest_type: generalProps.guest.guest_type[e.guest_type],
            enter_at: moment(e.enter_at).format("MM/DD HH:MM:SS")
          }));
          if (res.data) {
            setRows(tableData);
          }
        });
    }
  }, [exhibit_id]);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12}>
        <Box sx={{ height: '60vh', width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            checkboxSelection
          />
        </Box>
      </Grid>
    </Grid >
  );
};

export default ExhibitCurrentGuestList;