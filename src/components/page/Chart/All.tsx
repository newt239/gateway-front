import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { tokenState } from "#/recoil/user";
import { pageStateSelector } from "#/recoil/page";

import {
  Grid,
  Card,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";
const ChartAll = () => {
  const setPageInfo = useSetRecoilState(pageStateSelector);
  useEffect(() => {
    setPageInfo({ title: "滞在状況" });
  }, []);
  const navigate = useNavigate();

  const AllAreaSummaryCard = () => {
    return (
      <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
        <Typography variant="h3">全体の滞在状況</Typography>
        <List>
          <ListItem>
            <ListItemButton>
              <ListItemText>構内滞在者数 { }人</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Card>
    );
  };

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

  const [rows, setRows] = useState<exhibitListTableListProp>([]);
  const token = useRecoilValue(tokenState);

  useEffect(() => {
    if (token) {
      apiClient(process.env.REACT_APP_API_BASE_URL)
        .exhibit.current
        .$get({
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setRows(res);
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    }
  }, []);

  const ExhibitListCard = () => {
    return (<Card variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h3">展示別の滞在状況</Typography>
      <Box sx={{ p: 2, height: "50vh", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={50}
          hideFooter
          localeText={{
            noRowsLabel: '入室中のゲストはいません',
            footerRowSelected: (count) => `${count.toLocaleString()} 人を選択中`
          }}
        />
      </Box>
    </Card>
    );
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12}>
        <AllAreaSummaryCard />
      </Grid>
      <Grid item xs={12}>
        <ExhibitListCard />
      </Grid>
    </Grid>
  );
};

export default ChartAll;
