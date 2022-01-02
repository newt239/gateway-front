import React, { useEffect } from "react"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../stores/index';
import { setToken } from '../../stores/auth';
import { setExhibitList, updateCurrentExhibit } from '../../stores/exhibit';
import axios from 'axios';
import Home from './Home';
import Login from './Login';
import ExhibitIndex from './Exhibit/Index';
import Exhibit from './Exhibit/Exhibit';
import Crowd from './Crowd/Index';
import Heatmap from './Crowd/Heatmap';
import Status from './Crowd/Status';
import Entrance from './Entrance/Index';
import ReserveCheck from './Entrance/ReserveCheck';
import EntranceEnter from './Entrance/Enter';
import EntranceExit from './Entrance/Exit';
import Settings from './Settings';

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

const Body = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const token = useSelector((state: RootState) => state.auth.token);

    // 展示のリストを取得
    useEffect(() => {
        if (token) {
            axios.get(`${API_BASE_URL}/v1/exhibit/info/`, { headers: { Authorization: "Bearer " + token } }).then(res => {
                console.log(res);
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
            if (!token) {
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