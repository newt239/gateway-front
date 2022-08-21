import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { tokenAtom } from "#/components/lib/jotai";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import { Typography, Box } from "@mui/material";

import { handleApiError } from "#/components/lib/commonFunction";

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
            res.map((v) => {
              switch (v.guest_type) {
                case "student":
                  return "生徒";
                case "teacher":
                  return "教員";
                case "family":
                  return "保護者";
                default:
                  return "その他";
              }
            })
          );
          setAllAreaChartSeries(res.map((v) => v.count));
        })
        .catch((err: AxiosError) => {
          handleApiError(err, "exhibit_info_get");
        });
    }
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "pie",
      width: "100%",
      height: "50vh",
    },
    labels: allAreaChartCategories,
    noData: {
      text: "表示できるデータがありません",
    },
  };

  return (
    <>
      <Typography variant="h3">全体の滞在状況</Typography>
      {allAreaTotalCount ? (
        <>
          <Typography sx={{ p: 2 }}>
            校内滞在者数 {allAreaTotalCount}人
          </Typography>
          <Box sx={{ margin: "auto" }}>
            <ReactApexChart
              options={options}
              series={allAreaChartSeries}
              type="pie"
            />
          </Box>
        </>
      ) : (
        <Typography sx={{ p: 2 }}>現在校内に来場者はいません。</Typography>
      )}
    </>
  );
};
export default AllAreaPieChart;
