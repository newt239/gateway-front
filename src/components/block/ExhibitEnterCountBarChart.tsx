import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { tokenAtom } from "#/components/lib/jotai";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";
import moment from "moment";
import ReacrApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import { TextField } from "@mui/material";

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
            console.log(res);
            if (res.length !== 0) {
              const rawData: { time: string; count: number }[] = res;
              const timeList: string[] = [];
              const countList: number[] = [];
              let ctime = moment(rawData[0].time);
              // TODO: ツールチップに表示される時刻がUTC
              for (const eachData of rawData) {
                const eachTime = moment(eachData.time);
                while (ctime < eachTime) {
                  timeList.push(ctime.format("MM/DD HH:MM:SS"));
                  countList.push(0);
                  ctime = ctime.add(1, "hours");
                }
                timeList.push(eachTime.format("MM/DD HH:MM:SS"));
                countList.push(eachData.count);
              }
              setCategories(timeList);
              setData(countList);
            }
          })
          .catch((err: AxiosError) => {
            console.log(err);
          });
      }
    };
    getApi();
  }, [day]);
  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 400,
      zoom: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "datetime",
      categories: categories,
      labels: {
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
      <TextField
        id="date"
        label="選択中の日"
        type="date"
        defaultValue={day}
        onChange={(e) => setDay(e.target.value)}
        margin="normal"
      />
      <ReacrApexChart options={options} series={series} width="100%" type="bar" />
    </>
  );
};

export default ExhibitEnterCountBarChart;
