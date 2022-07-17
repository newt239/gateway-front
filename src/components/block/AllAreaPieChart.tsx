import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { tokenState } from "#/recoil/user";

import { Card, Typography, Box } from "@mui/material";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";
// @ts-ignore
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const AllAreaPieChart = () => {
  const token = useRecoilValue(tokenState);
  const [allAreaTotalCount, setAllAreaTotalCount] = useState<number>(0);
  const [allAreaChartCategories, setAllAreaChartCategories] = useState<
    string[]
  >(["general"]);
  const [allAreaChartSeries, setAllAreaChartSeries] = useState<number[]>([0]);

  useEffect(() => {
    if (token) {
      apiClient(process.env.REACT_APP_API_BASE_URL)
        .exhibit.info.$get({
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setAllAreaTotalCount(res.reduce((a, c) => a + c.count, 0));
          setAllAreaChartCategories(res.map((v) => v.guest_type));
          setAllAreaChartSeries(res.map((v) => v.count));
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    }
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "pie",
    },
    labels: allAreaChartCategories,
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    noData: {
      text: "表示できるデータがありません",
    },
  };

  return (
    <>
      {allAreaTotalCount && (
        <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
          <Typography variant="h3">全体の滞在状況</Typography>
          <Typography>校内滞在者数 {allAreaTotalCount}人</Typography>
          <Box sx={{ margin: "auto", width: "100%" }}>
            <Chart options={options} series={allAreaChartSeries} type="pie" />
          </Box>
        </Card>
      )}
    </>
  );
};
export default AllAreaPieChart;
