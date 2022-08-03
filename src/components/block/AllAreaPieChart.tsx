import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { tokenAtom } from "#/components/lib/jotai";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import { Typography, Box } from "@mui/material";

const AllAreaPieChart = () => {
  const token = useAtomValue(tokenAtom);
  const [allAreaTotalCount, setAllAreaTotalCount] = useState<number>(0);
  const [allAreaChartCategories, setAllAreaChartCategories] = useState<
    string[]
  >(["保護者", "生徒", "教員"]);
  const [allAreaChartSeries, setAllAreaChartSeries] = useState<number[]>([0]);

  useEffect(() => {
    if (token) {
      apiClient(process.env.REACT_APP_API_BASE_URL)
        .exhibit.info.$get({
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setAllAreaTotalCount(res.reduce((a, c) => a + c.count, 0));
          setAllAreaChartCategories(
            res.map((v) =>
              v.guest_type === "student"
                ? "生徒"
                : v.guest_type === "teacher"
                  ? "教員"
                  : v.guest_type === "family"
                    ? "保護者"
                    : "その他"
            )
          );
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
      width: "100%",
      height: "50vh"
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
      <Typography variant="h3">全体の滞在状況</Typography>
      {allAreaTotalCount ? (
        <>
          <Typography sx={{ pt: 2 }}>
            校内滞在者数 {allAreaTotalCount}人
          </Typography>
          <Box sx={{ margin: "auto", width: "100%" }}>
            <ReactApexChart options={options} series={allAreaChartSeries} type="pie" />
          </Box>
        </>
      ) : (
        <Typography sx={{ pt: 2 }}>読み込み中...</Typography>
      )}
    </>
  );
};
export default AllAreaPieChart;
