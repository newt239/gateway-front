import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { tokenState, profileState } from "#/recoil/user";
import ReactGA from "react-ga4";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";

import MessageDialog from "#/components/block/MessageDialog";
import Home from "#/components/page/Home";
import Login from "#/components/page/Login";
import ExhibitIndex from "#/components/page/Exhibit/Index";
import ExhibitScan from "#/components/page/Exhibit/ExhibitScan";
import ChartIndex from "#/components/page/Chart/Index";
import ChartExhibit from "#/components/page/Chart/Exhibit";
import Heatmap from "#/components/page/Chart/Heatmap";
import Entrance from "#/components/page/Entrance/Index";
import ReserveCheck from "#/components/page/Entrance/ReserveCheck";
import EntranceEnter from "#/components/page/Entrance/Enter";
import EntranceExit from "#/components/page/Entrance/Exit";
import DocsMarkdown from "#/components/page/Docs/Markdown";
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
      apiClient(process.env.REACT_APP_API_BASE_URL)
        .auth.me.$get({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((meRes) => {
          setProfile(meRes);
          ReactGA.event({
            category: "login",
            action: "auto_success",
            label: meRes.user_id,
          })
        })
        .catch((err: AxiosError) => {
          if (err.message === "Network Error") {
            setErrorDialogTitle("サーバーが起動していません");
            setMessageDialogMessage([
              "コストカットのため必要時以外はサーバーを停止させています。",
            ]);
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
            <Route path="docs/:doc_id" element={<DocsMarkdown />} />
            <Route path="exhibit">
              // すべてのページにアクセス可能
              {["admin", "moderator"].includes(profile.user_type) ? (
                <>
                  <Route index element={<ExhibitIndex />} />
                  <Route path=":exhibit_id">
                    <Route
                      path="enter"
                      element={<ExhibitScan scanType="enter" />}
                    />
                    <Route
                      path="exit"
                      element={<ExhibitScan scanType="exit" />}
                    />
                  </Route>
                  // 自分の展示のページのみアクセス可能
                </>
              ) : ["exhibit"].includes(profile.user_type) ? (
                <>
                  <Route index element={<ExhibitIndex />} />
                  <Route path={profile.user_id}>
                    <Route
                      path="enter"
                      element={<ExhibitScan scanType="enter" />}
                    />
                    <Route
                      path="exit"
                      element={<ExhibitScan scanType="exit" />}
                    />
                  </Route>
                </>
              ) : (
                <Route path="*" element={<Extra type="401" />} />
              )}
            </Route>
            <Route path="entrance">
              {["admin", "moderator", "executive"].includes(
                profile.user_type
              ) ? (
                <>
                  <Route index element={<Entrance />} />
                  <Route path="reserve-check" element={<ReserveCheck />} />
                  <Route path="enter" element={<EntranceEnter />} />
                  <Route path="exit" element={<EntranceExit />} />
                </>
              ) : (
                <Route path="*" element={<Extra type="401" />} />
              )}
            </Route>
            <Route path="chart">
              {["admin", "moderator", "analysis"].includes(
                profile.user_type
              ) ? (
                <>
                  <Route index element={<ChartIndex />} />
                  <Route
                    path="exhibit/:exhibit_id"
                    element={<ChartExhibit />}
                  />
                  <Route path="heatmap" element={<Heatmap />} />
                </>
              ) : ["exhibit"].includes(profile.user_type) ? (
                <>
                  <Route
                    path={`exhibit/${profile.user_id}`}
                    element={<ChartExhibit />}
                  />
                </>
              ) : (
                <Route path="*" element={<Extra type="401" />} />
              )}
            </Route>
            <Route path="admin">
              {["admin", "moderator"].includes(profile.user_type) ? (
                <>
                  <Route path="guest" element={<AdminCheckGuest />} />
                  <Route path="exhibit" element={<AdminManageExhibit />} />
                </>
              ) : (
                <Route path="*" element={<Extra type="401" />} />
              )}
            </Route>
            <Route path="*" element={<Extra type="404" />} />
          </>
        ) : (
          <Route path="*" element={<Login />} />
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
