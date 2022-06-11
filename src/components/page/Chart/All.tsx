import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { tokenState } from "#/recoil/user";
import { pageStateSelector } from "#/recoil/page";

import {
  Grid,
  Card,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";
// @ts-ignore
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const ChartAll = () => {
  const setPageInfo = useSetRecoilState(pageStateSelector);
  const token = useRecoilValue(tokenState);
  useEffect(() => {
    setPageInfo({ title: "滞在状況" });
  }, []);
  const navigate = useNavigate();

  const AllAreaSummaryCard = () => {
    const [totalCount, setTotalCount] = useState<number>(0);
    const [categories, setCategories] = useState<string[]>([]);
    const [series, setSeries] = useState<number[]>([]);
    const options: ApexOptions = {
      chart: {
        width: 200,
        type: 'pie',
      },
      labels: categories, responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 100
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      noData: {
        text: "表示できるデータがありません",
      },
    };
    useEffect(() => {
      if (token) {
        apiClient(process.env.REACT_APP_API_BASE_URL)
          .exhibit.info
          .$get({
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setTotalCount(res.reduce((a, c) => a + c.count, 0))
            setCategories(res.map(v => v.guest_type));
            setSeries(res.map(v => v.count));
          })
          .catch((err: AxiosError) => {
            console.log(err);
          });
      }
    }, [token]);
    return (
      <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
        <Typography variant="h3">全体の滞在状況</Typography>
        {totalCount && (<Typography>校内滞在者数 {totalCount}人</Typography>)}
        <Chart options={options} series={series} height="300" type="pie" />
      </Card>
    );
  };

  const ExhibitListCard = () => {
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
    }, [token]);

    return (<Card variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h3">展示別の滞在状況</Typography>
      <Box sx={{ p: 2, height: "50vh", width: "100%" }}>
        <DataGrid
          rows={rows}
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
