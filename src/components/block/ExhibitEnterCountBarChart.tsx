import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { tokenState } from "#/recoil/user";
// @ts-ignore
import Chart from "react-apexcharts";
// https://github.com/apexcharts/react-apexcharts/issues/368#issuecomment-1003686683
import { ApexOptions } from "apexcharts";
import moment from "moment";
import apiClient from "#/axios-config";

import { TextField } from "@mui/material";

const ExhibitEnterCountBarChart: React.FunctionComponent<{
  exhibit_id: string;
}> = ({ exhibit_id }) => {
  const token = useRecoilValue(tokenState);
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
          .catch((err) => {
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
    },
    yaxis: {
      labels: {
        formatter: (value) => {
          return value.toFixed(1);
        },
      },
    },
    tooltip: {
      x: {
        format: "MM/dd HH:00",
      },
    },
    noData: {
      text: "表示するデータがありません",
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
      <Chart options={options} series={series} width="100%" type="bar" />
    </>
  );
};

export default ExhibitEnterCountBarChart;
