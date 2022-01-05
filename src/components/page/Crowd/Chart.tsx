import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { RootState } from '#/stores/index';
import axios from 'axios';
import Chart from "react-apexcharts";

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

const Apexchart = () => {
    const token = useSelector((state: RootState) => state.user).token;
    const [categories, setCategories] = useState([]);
    const [data, setData] = useState([]);
    const getApi = async () => {
        const res = await axios.get(`${API_BASE_URL}/v1/exhibit/crowd`, { headers: { Authorization: "Bearer " + token } }).then(res => { return res });
        setCategories(res.data.data.map((e: any) => { return e.TIME }));
        setData(res.data.data.map((e: any) => { return e.count }));
    };
    const state = {
        options: {
            chart: {
                id: "basic-bar"
            },
            xaxis: {
                categories: categories,
            },
        },
        series: [
            {
                name: 'Net Profit',
                data: data
            }
        ]
    };
    return (
        <>
            <Chart
                options={state.options}
                series={state.series}
                type="bar"
                width="100%"
            />
            <button onClick={getApi}>reload</button>
        </>
    );
}

export default Apexchart;