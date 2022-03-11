import React, { useEffect, useLayoutEffect } from "react"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { tokenState, profileState } from "#/recoil/user";
import { currentExhibitState, exhibitListState } from "#/recoil/exhibit";
import axios from 'axios';

import Home from '#/components/page/Home';
import Login from '#/components/page/Login';
import ExhibitIndex from '#/components/page/Exhibit/Index';
import ExhibitScan from '#/components/page/Exhibit/ExhibitScan';
import ChartAll from '#/components/page/Chart/All';
import ChartExhibit from '#/components/page/Chart/Exhibit';
import Heatmap from '#/components/page/Chart/Heatmap';
import Entrance from '#/components/page/Entrance/Index';
import ReserveCheck from '#/components/page/Entrance/ReserveCheck';
import EntranceEnter from '#/components/page/Entrance/Enter';
import EntranceExit from '#/components/page/Entrance/Exit';
import DocsIndex from '#/components/page/Docs/Index';
import DocsEach from '#/components/page/Docs/Each';
import AdminIndex from '#/components/page/Admin/Index';

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

const Body = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [token, setToken] = useRecoilState(tokenState);

    // 展示のリストを取得
    const setCurrentExhibit = useSetRecoilState(currentExhibitState);
    const setExhibitList = useSetRecoilState(exhibitListState);
    useEffect(() => {
        if (token) {
            axios.get(`${API_BASE_URL}/v1/exhibit/info/`, { headers: { Authorization: "Bearer " + token } }).then(res => {
                if (res.data) {
                    setExhibitList(res.data.data);
                    setCurrentExhibit(res.data.data[0]);
                };
            });
        }
    }, []);

    const [profile, setProfile] = useRecoilState(profileState);
    useEffect(() => {
        if (location.pathname !== "/login") {
            if (!token) {
                const localStorageToken: string | null = localStorage.getItem('gatewayApiToken');
                if (localStorageToken) {
                    // プロフィールの取得
                    axios.get(API_BASE_URL + "/v1/auth/me", { headers: { Authorization: "Bearer " + localStorageToken } }).then(res => {
                        setProfile(res.data.profile);
                        setToken(localStorageToken);
                    });
                } else {
                    // 未ログイン時ログインページへ遷移
                    navigate("/login", { replace: true });
                }
            } else {
                // レンダリング後に呼び出すことでレンダリング後のstateの変化を反映させている
                console.log(profile);
            }
        }
    }, []);

    return (
        <Routes>
            <Route path="/">
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="exhibit" >
                    <Route index element={<ExhibitIndex />} />
                    <Route path="enter" element={<ExhibitScan scanType="enter" />} />
                    <Route path="exit" element={<ExhibitScan scanType="exit" />} />
                    <Route path="pass" element={<ExhibitScan scanType="pass" />} />
                </Route>
                <Route path="entrance" >
                    <Route index element={<Entrance />} />
                    <Route path="reserve-check" element={<ReserveCheck />} />
                    <Route path="enter" element={<EntranceEnter />} />
                    <Route path="exit" element={<EntranceExit />} />
                </Route>
                <Route path="chart" >
                    <Route path="all" element={<ChartAll />} />
                    <Route path="exhibit/:exhibit_id" element={<ChartExhibit />} />
                    <Route path="heatmap" element={<Heatmap />} />
                </Route>
                <Route path="docs">
                    <Route index element={<DocsIndex />} />
                    <Route path=":doc_id" element={<DocsEach />} />
                </Route>
                <Route path="admin">
                    <Route index element={<AdminIndex />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default Body;