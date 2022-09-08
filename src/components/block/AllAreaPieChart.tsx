import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { tokenAtom } from "#/components/lib/jotai";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import {
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
} from "@mui/material";

import { handleApiError } from "#/components/lib/commonFunction";
import useDeviceWidth from "#/components/lib/useDeviceWidth";

const AllAreaPieChart: React.VFC = () => {
  const { largerThanSM, largerThanLG } = useDeviceWidth();
  const token = useAtomValue(tokenAtom);
  const [allAreaCount, setAllAreaCount] = useState<
    { guest_type: string; count: number }[]
  >([]);
  const [allAreaChartCategories, setAllAreaChartCategories] = useState<
    string[]
  >(["保護者", "生徒", "教員"]);
  const [allAreaChartSeries, setAllAreaChartSeries] = useState<number[]>([0]);
  const [loading, setLoading] = useState<boolean>(false);

  const getAllAreaInfo = () => {
    if (token) {
      setLoading(true);
      apiClient(process.env.REACT_APP_API_BASE_URL)
        .exhibit.info.$get({
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setAllAreaCount(res);
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
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // 15秒ごとに自動で取得
  useEffect(() => {
    getAllAreaInfo();
    const intervalId = setInterval(() => {
      getAllAreaInfo();
    }, 5 * 60 * 1000);
    return () => {
      clearInterval(intervalId);
    };
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

  const EachGuestTypeListItem: React.VFC<{
    guest_type: string;
    type_name: string;
  }> = ({ guest_type, type_name }) => {
    return (
      <ListItem
        divider
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body1">{type_name}</Typography>
        <Typography variant="body1">
          <span style={{ fontSize: "1.5rem", fontWeight: 800 }}>
            {allAreaCount.filter((v) => v.guest_type === guest_type)[0]
              ?.count || 0}
          </span>{" "}
          人
        </Typography>
      </ListItem>
    );
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 30,
        }}
      >
        <Typography variant="h3">全体の滞在状況</Typography>
        {loading && <CircularProgress size={25} thickness={6} />}
      </Box>
      {allAreaCount.length !== 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: largerThanSM && !largerThanLG ? "row" : "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <ReactApexChart
              options={options}
              series={allAreaChartSeries}
              type="pie"
            />
          </Box>
          <List dense sx={{ width: "100%", maxWidth: 350 }}>
            <EachGuestTypeListItem guest_type="family" type_name="保護者" />
            <EachGuestTypeListItem guest_type="student" type_name="生徒" />
            <EachGuestTypeListItem guest_type="teacher" type_name="教員" />
            <EachGuestTypeListItem guest_type="other" type_name="その他" />
            <ListItem
              divider
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h4">総数</Typography>
              <Typography variant="body1">
                <span style={{ fontSize: "2rem", fontWeight: 800 }}>
                  {allAreaCount.reduce((a, c) => a + c.count, 0) || 0}
                </span>{" "}
                人
              </Typography>
            </ListItem>
          </List>
        </Box>
      ) : loading ? (
        <Typography variant="body1" sx={{ p: 2 }}>
          読み込み中...
        </Typography>
      ) : (
        <Typography variant="body1" sx={{ p: 2 }}>
          現在校内に来場者はいません。
        </Typography>
      )}
    </>
  );
};
export default AllAreaPieChart;
