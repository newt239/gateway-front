import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { tokenState, profileState } from "#/recoil/user";
import { AxiosError } from "axios";
import aspidaClient from "@aspida/axios";
import api from "#/api/$api";

import MessageDialog from "#/components/block/MessageDialog";
import Home from "#/components/page/Home";
import Login from "#/components/page/Login";
import ExhibitIndex from "#/components/page/Exhibit/Index";
import ExhibitScan from "#/components/page/Exhibit/ExhibitScan";
import ChartAll from "#/components/page/Chart/All";
import ChartExhibit from "#/components/page/Chart/Exhibit";
import Heatmap from "#/components/page/Chart/Heatmap";
import Entrance from "#/components/page/Entrance/Index";
import ReserveCheck from "#/components/page/Entrance/ReserveCheck";
import EntranceEnter from "#/components/page/Entrance/Enter";
import EntranceExit from "#/components/page/Entrance/Exit";
import DocsIndex from "#/components/page/Docs/Index";
import DocsEach from "#/components/page/Docs/Each";
import AdminManageUser from "#/components/page/Admin/ManageUser";
import AdminCheckGuest from "#/components/page/Admin/CheckGuest";
import AdminManageExhibit from "#/components/page/Admin/ManageExhibit";
import Extra from "#/components/page/Extra";


const Body = () => {
  const navigate = useNavigate();
  const token = useRecoilValue(tokenState);
  const [profile, setProfile] = useRecoilState(profileState);

  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [errorDialogTitle, setErrorDialogTitle] = useState("");
  const [errorDialogMessage, setMessageDialogMessage] = useState<string[]>([]);

  useEffect(() => {
    if (token) {
      // プロフィールの取得
      api(aspidaClient()).auth.me.$get({
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((meRes) => {
        setProfile(meRes);
      }).catch((err: AxiosError) => {
        if (err.message === "Network Error") {
          setErrorDialogTitle("サーバーが起動していません");
          setMessageDialogMessage(["コストカットのため必要時以外はサーバーを停止させています。"]);
        } else {
          setMessageDialogMessage([err.message]);
        }
        setShowMessageDialog(true);
      });
    } else {
      // 未ログイン時ログインページへ遷移
      navigate("/login", { replace: true });
    }
  }, []);

  const handleClose = () => {
    setShowMessageDialog(false);
    setMessageDialogMessage([]);
  };

  return (
    <>
      <Routes>
        {profile ? (
          <>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            {["admin", "moderator", "exhibit"].includes(profile.user_type) ? (
              <Route path="exhibit">
                <Route index element={<ExhibitIndex />} />
                <Route
                  path="enter"
                  element={<ExhibitScan scanType="enter" />}
                />
                <Route path="exit" element={<ExhibitScan scanType="exit" />} />
              </Route>
            ) : (
              <Navigate to="/" />
            )}
            {["admin", "moderator", "executive"].includes(profile.user_type) ? (
              <Route path="entrance">
                <Route index element={<Entrance />} />
                <Route path="reserve-check" element={<ReserveCheck />} />
                <Route path="enter" element={<EntranceEnter />} />
                <Route path="exit" element={<EntranceExit />} />
              </Route>
            ) : (
              <Navigate to="/" />
            )}
            {["admin", "moderator", "analysis"].includes(profile.user_type) ? (
              <Route path="chart">
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
                <Route path="user" element={<AdminManageUser />} />
                <Route path="guest" element={<AdminCheckGuest />} />
                <Route path="exhibit" element={<AdminManageExhibit />} />
              </Route>
            ) : (
              <Navigate to="/" />
            )}
            <Route path="*" element={<Extra kind="not-found" />} />
          </>
        ) : (
          <Route path="*" element={<Extra kind="unauthenticated" />} />
        )}
      </Routes>
      <MessageDialog
        open={showMessageDialog}
        type="error"
        title={errorDialogTitle}
        message={errorDialogMessage}
        onClose={handleClose}
      />
    </>
  );
};

export default Body;
