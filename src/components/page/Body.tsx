import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
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
  const token = useRecoilValue(tokenState)
  const [profile, setProfile] = useRecoilState(profileState)
  useEffect(() => {
    if (location.pathname !== "/login") {
      if (token) {
        // プロフィールの取得
        axios.get(API_BASE_URL + "/v1/auth/me", { headers: { Authorization: "Bearer " + token } }).then(res => {
          console.log(res.data);
          setProfile(res.data.profile);
        })
      } else {
        // 未ログイン時ログインページへ遷移
        navigate("/login", { replace: true });
      }
    }
  }, []);

  const NotFound = () => {
    return (
      <>
        <p>お探しのページは見つかりませんでした。</p>
        <span onClick={e => navigate("/", { replace: true })}>トップに戻る</span>
      </>
    );
  }

  return (
    <>
      {profile ? (
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            {["admin", "moderator", "exhibit"].includes(profile.user_type) ? (
              <Route path="exhibit" >
                <Route index element={<ExhibitIndex />} />
                <Route path="enter" element={<ExhibitScan scanType="enter" />} />
                <Route path="exit" element={<ExhibitScan scanType="exit" />} />
                <Route path="pass" element={<ExhibitScan scanType="pass" />} />
              </Route>
            ) : (
              <Navigate to="/" />
            )}
            {["admin", "moderator", "executive"].includes(profile.user_type) ? (
              <Route path="entrance" >
                <Route index element={<Entrance />} />
                <Route path="reserve-check" element={<ReserveCheck />} />
                <Route path="enter" element={<EntranceEnter />} />
                <Route path="exit" element={<EntranceExit />} />
              </Route>
            ) : (
              <Navigate to="/" />
            )}
            {["admin", "moderator", "analysis"].includes(profile.user_type) ? (
              <Route path="chart" >
                <Route path="all" element={<ChartAll />} />
                <Route path="exhibit/:exhibit_id" element={<ChartExhibit />} />
                <Route path="heatmap" element={<Heatmap />} />
              </Route>
            ) : (
              <Navigate to="/" />
            )}
            <Route path="docs">
              <Route index element={<DocsIndex />} />
              <Route path=":doc_id" element={<DocsEach />} />
            </Route>
            {["admin", "moderator"].includes(profile.user_type) ? (
              <Route path="admin">
                <Route index element={<AdminIndex />} />
              </Route>
            ) : (
              <Navigate to="/" />
            )}
            <Route element={<NotFound />} />
          </Route>
        </Routes>
      ) : (<>Loading...</>)}
    </>
  );
};

export default Body;