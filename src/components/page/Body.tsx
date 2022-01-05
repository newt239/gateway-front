import React, { useEffect } from "react"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '#/stores/index';
import { setToken } from '#/stores/user';
import { setExhibitList, updateCurrentExhibit } from '#/stores/exhibit';
import axios from 'axios';

import Home from '#/components/page/Home';
import Login from '#/components/page/Login';
import ExhibitIndex from '#/components/page/Exhibit/Index';
import Exhibit from '#/components/page/Exhibit/Exhibit';
import Crowd from '#/components/page/Crowd/Index';
import Heatmap from '#/components/page/Crowd/Heatmap';
import Status from '#/components/page/Crowd/Status';
import Entrance from '#/components/page/Entrance/Index';
import ReserveCheck from '#/components/page/Entrance/ReserveCheck';
import EntranceEnter from '#/components/page/Entrance/Enter';
import EntranceExit from '#/components/page/Entrance/Exit';
import Settings from '#/components/page/Settings';

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

const Body = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);

    // 展示のリストを取得
    useEffect(() => {
        if (user.token) {
            axios.get(`${API_BASE_URL}/v1/exhibit/info/`, { headers: { Authorization: "Bearer " + user.token } }).then(res => {
                if (res.data) {
                    dispatch(setExhibitList(res.data.data));
                    dispatch(updateCurrentExhibit(res.data.data[0]))
                };
            });
        };
    }, [user]);

    // 未ログイン時ログインページへ遷移
    useEffect(() => {
        if (location.pathname !== "/login") {
            if (!user.token) {
                const localStorageToken: string | null = localStorage.getItem('gatewayApiToken');
                if (localStorageToken) {
                    dispatch(setToken(localStorageToken));
                } else {
                    navigate("/login", { replace: true });
                }
            }
        }
    }, [localStorage.getItem('gatewayApiToken'), location]);
    return (
        <Routes>
            <Route path="/">
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="exhibit" >
                    <Route index element={<ExhibitIndex />} />
                    <Route path="enter" element={<Exhibit scanType="enter" />} />
                    <Route path="exit" element={<Exhibit scanType="exit" />} />
                    <Route path="pass" element={<Exhibit scanType="pass" />} />
                </Route>
                <Route path="entrance" >
                    <Route index element={<Entrance />} />
                    <Route path="reserve-check" element={<ReserveCheck />} />
                    <Route path="enter" element={<EntranceEnter />} />
                    <Route path="exit" element={<EntranceExit />} />
                </Route>
                <Route path="crowd" >
                    <Route index element={<Crowd />} />
                    <Route path="heatmap" element={<Heatmap />} />
                    <Route path="status" element={<Status />} />
                </Route>
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
    );
};

export default Body;