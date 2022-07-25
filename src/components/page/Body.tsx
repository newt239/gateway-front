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
import AnalyticsIndex from "#/components/page/Analytics/Index";
import AnalyticsExhibit from "#/components/page/Analytics/Exhibit";
import AnalyticsSummary from "#/components/page/Analytics/Summary";
import Entrance from "#/components/page/Entrance/Index";
import ReserveCheck from "#/components/page/Entrance/ReserveCheck";
import EntranceEnter from "#/components/page/Entrance/Enter";
import EntranceExit from "#/components/page/Entrance/Exit";
import AdminCheckGuest from "#/components/page/Admin/CheckGuest";
import AdminLostWristband from "#/components/page/Admin/LostWristband";
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
          });
        })
        .catch((err: AxiosError) => {
          if (err.response) {
            if (err.response.status === 401) {
              setErrorDialogTitle("セッションがタイムアウトしました");
              setMessageDialogMessage([
                "最後のログインから一定時間が経過したためログアウトしました。再度ログインしてください。",
              ]);
              ReactGA.event({
                category: "login",
                action: "session_timeout",
                label: err.message,
              });
            } else {
              setMessageDialogMessage([err.response.statusText]);
              ReactGA.event({
                category: "login",
                action: "unknown_error",
                label: err.response.statusText,
              });
            }
          } else {
            if (err.message === "Network Error") {
              setErrorDialogTitle("サーバーが起動していません");
              setMessageDialogMessage([
                "コストカットのため必要時以外はサーバーを停止させています。",
              ]);
              ReactGA.event({
                category: "login",
                action: "network_error",
                label: err.message,
              });
            } else {
              setMessageDialogMessage([err.message]);
              setShowMessageDialog(true);
              ReactGA.event({
                category: "login",
                action: "unknown_error",
                label: err.message,
              });
            }
          }
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
        <>
          <Route path="login" element={<Login />} />
          {profile ? (
            <>
              <Route index element={<Home />} />
              <Route path="exhibit">
                <Route index element={<ExhibitIndex />} />
                {["moderator", "executive", "exhibit"].includes(
                  profile.user_type
                ) ? (
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
                ) : (
                  <Route path="*" element={<Extra type="401" />} />
                )}
              </Route>
              <Route path="entrance">
                {["moderator", "executive"].includes(profile.user_type) ? (
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
              <Route path="analytics">
                {["moderator"].includes(profile.user_type) ? (
                  <>
                    <Route index element={<AnalyticsIndex />} />
                    <Route
                      path="exhibit/:exhibit_id"
                      element={<AnalyticsExhibit />}
                    />
                    <Route path="summary" element={<AnalyticsSummary />} />
                  </>
                ) : ["exhibit"].includes(profile.user_type) ? (
                  <>
                    <Route
                      path={`exhibit/${profile.user_id}`}
                      element={<AnalyticsExhibit />}
                    />
                  </>
                ) : (
                  <Route path="*" element={<Extra type="401" />} />
                )}
              </Route>
              <Route path="admin">
                {["moderator"].includes(profile.user_type) ? (
                  <>
                    <Route path="guest" element={<AdminCheckGuest />} />
                    <Route
                      path="lost-wristband"
                      element={<AdminLostWristband />}
                    />
                  </>
                ) : (
                  <Route path="*" element={<Extra type="401" />} />
                )}
              </Route>
              <Route path="*" element={<Extra type="404" />} />
            </>
          ) : (
            <Route path="*" element={<Extra type="loading" />} />
          )}
        </>
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
