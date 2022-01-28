import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { RootState } from '#/stores/index';
import axios from 'axios';
import Chart from "react-apexcharts";
// https://github.com/apexcharts/react-apexcharts/issues/368#issuecomment-1003686683
import { ApexOptions } from "apexcharts";
import moment from "moment";

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

const ExhibitEnterCountBarChart: React.FunctionComponent<{ exhibit_id: string; }> = ({ exhibit_id }) => {
    const token = useSelector((state: RootState) => state.user).token;
    const [categories, setCategories] = useState<string[]>([]);
    const [data, setData] = useState<number[]>([]);
    useEffect(() => {
        if (token) {
            const getApi = async () => {
                const res = await axios.get(`${API_BASE_URL}/v1/exhibit/enter-chart/${exhibit_id}`, { headers: { Authorization: "Bearer " + token } }).then(res => { return res });
                if (res.data.status === "success" && res.data.data.length !== 0) {
                    const rawData: { time: string; count: number; }[] = res.data.data;
                    let timeList: string[] = [];
                    let countList: number[] = [];
                    let ctime = moment(rawData[0].time);
                    for (const eachData of rawData) {
                        const eachTime = moment(eachData.time);
                        while (ctime < eachTime) {
                            timeList.push(ctime.format("MM/DD HH:MM:SS"));
                            countList.push(0);
                            ctime = ctime.add(1, "hours");
                        }
                        timeList.push(eachTime.format("MM/DD HH:MM:SS"));
                        countList.push(eachData.count);
                    };
                    setCategories(timeList);
                    setData(countList);
                    console.log(countList);
                };
            };
            getApi();
        };
    }, [token]);
    const options: ApexOptions = {
        chart: {
            type: "bar",
            height: 400,
            zoom: {
                enabled: true
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 2
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            type: "datetime",
            categories: categories,
        },
        yaxis: {
            labels: {
                formatter: (value) => {
                    return value.toFixed(1)
                }
            }
        },
        tooltip: {
            x: {
                format: "MM/dd HH:00"
            }
        }
    };
    const series = [
        {
            name: '入室数',
            data: data
        }
    ];
    return (
        <>
            <Chart
                options={options}
                series={series}
                width="100%"
                type="bar"
            />
        </>
    );
};

export default ExhibitEnterCountBarChart;