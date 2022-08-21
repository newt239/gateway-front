import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { tokenAtom } from "#/components/lib/jotai";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";
import moment from "moment";
import ReacrApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import { TextField, Typography } from "@mui/material";

import { handleApiError } from "#/components/lib/commonFunction";

const ExhibitEnterCountBarChart: React.FunctionComponent<{
  exhibit_id: string;
}> = ({ exhibit_id }) => {
  const token = useAtomValue(tokenAtom);
  const [categories, setCategories] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);
  const [day, setDay] = useState(moment().format("YYYY-MM-DD"));

  useEffect(() => {
    const getApi = () => {
      if (token) {
        apiClient(process.env.REACT_APP_API_BASE_URL)
          .exhibit.history._exhibit_id(exhibit_id)
          ._day(day)
          .$get({ headers: { Authorization: `Bearer ${token}` } })
          .then((res) => {
            if (res.length !== 0) {
              const rawData: { time: string; count: number }[] = res;
              const timeList: string[] = [];
              const countList: number[] = [];
              let ctime = moment(`${day} 00:00`);
              let i = 0;
              while (ctime < moment(`${day} 24:00`)) {
                if (
                  i < rawData.length &&
                  ctime.format("HH") == moment(rawData[i].time).format("HH")
                ) {
                  countList.push(rawData[i].count);
                  i++;
                } else {
                  countList.push(0);
                }
                timeList.push(ctime.format("MM/DD HH:mm:ss"));
                ctime = ctime.add(1, "hours");
              }
              setCategories(timeList);
              setData(countList);
            }
          })
          .catch((err: AxiosError) => {
            handleApiError(err, "exhibit_history_each_get");
          });
      }
    };
    getApi();
  }, [day]);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 400,
    },
    plotOptions: {
      bar: {
        borderRadius: 3,
        columnWidth: "70%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "datetime",
      tickPlacement: "on",
      tickAmount: "dataPoints",
      categories: categories,
      labels: {
        format: "HH:00",
        showDuplicates: false,
        datetimeUTC: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => {
          return value.toFixed(0);
        },
      },
    },
    tooltip: {
      x: {
        format: "MM/dd HH:00",
      },
    },
    noData: {
      text: "この日の展示への入室記録がありません",
    },
  };
  const series = [
    {
      name: "入室数",
      data: data,
    },
  ];

  return (
    <>
      <Typography variant="body1" sx={{ p: 2 }}>
        1時間ごとの入室者数を表示します。
      </Typography>
      <TextField
        id="date"
        label="選択中の日"
        type="date"
        defaultValue={day}
        onChange={(e) => setDay(e.target.value)}
        margin="normal"
      />
      <ReacrApexChart
        options={options}
        series={series}
        width="100%"
        type="bar"
      />
    </>
  );
};

export default ExhibitEnterCountBarChart;
