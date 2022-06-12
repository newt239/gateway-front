import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { tokenState } from "#/recoil/user";

import {
  Card,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";

const ExhibitListCard = () => {
  const navigate = useNavigate();
  const token = useRecoilValue(tokenState);
  const [exhibitListTableRows, setExhibitListTableRows] = useState<exhibitListTableListProp>([]);
  const columns: GridColDef[] = [
    { field: "id", headerName: "展示id" },
    {
      field: "exhibit_name", headerName: "展示名", width: 200, renderCell: (params) => (
        <Button onClick={() => navigate(`/chart/exhibit/${params.id}`, { replace: true })}>{params.value}</Button>
      ),
    },
    { field: "count", headerName: "現在の人数" },
    { field: "capacity", headerName: "上限" },
  ];

  type exhibitListTableListProp = {
    id: string;
    exhibit_name: string;
    count: number;
    capacity: number;
  }[];


  useEffect(() => {
    if (token) {
      apiClient(process.env.REACT_APP_API_BASE_URL)
        .exhibit.current
        .$get({
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setExhibitListTableRows(res);
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    }
  }, [token]);

  return (<Card variant="outlined" sx={{ p: 2 }}>
    <Typography variant="h3">展示別の滞在状況</Typography>
    <Box sx={{ p: 2, height: "50vh", width: "100%" }}>
      <DataGrid
        rows={exhibitListTableRows}
        columns={columns}
        rowHeight={50}
        hideFooter
        localeText={{
          noRowsLabel: '現在有効な展示がありません'
        }}
      />
    </Box>
  </Card>
  );
};

export default ExhibitListCard;
