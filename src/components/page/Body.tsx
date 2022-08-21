import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAtom, useAtomValue } from "jotai";
import { tokenAtom, profileAtom } from "#/components/lib/jotai";
import ReactGA from "react-ga4";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";

import { handleApiError } from "#/components/lib/commonFunction";
import Home from "#/components/page/Home";
import Login from "#/components/page/Login";
import ExhibitIndex from "#/components/page/Exhibit/Index";
import ExhibitScan from "#/components/page/Exhibit/ExhibitScan";
import AnalyticsIndex from "#/components/page/Analytics/Index";
import AnalyticsExhibit from "#/components/page/Analytics/Exhibit";
import AnalyticsSummary from "#/components/page/Analytics/Summary";
import EntranceIndex from "#/components/page/Entrance/Index";
import ReserveCheck from "#/components/page/Entrance/ReserveCheck";
import EntranceEnter from "#/components/page/Entrance/Enter";
import EntranceExit from "#/components/page/Entrance/Exit";
import AdminCheckGuest from "#/components/page/Admin/CheckGuest";
import AdminLostWristband from "#/components/page/Admin/LostWristband";
import Extra from "#/components/page/Extra";
import MessageDialog from "#/components/block/MessageDialog";

const Body = () => {
  const navigate = useNavigate();
  const token = useAtomValue(tokenAtom);
  const [profile, setProfile] = useAtom(profileAtom);

  const [showMessageDialog, setShowMessageDialog] = useState<boolean>(false);
  const [errorDialogTitle, setErrorDialogTitle] = useState<string>("");
  const [errorDialogMessage, setMessageDialogMessage] = useState<string>("");

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
          localStorage.setItem("user_id", meRes.user_id);
          ReactGA.event({
            category: "login",
            action: "auto_success",
            label: meRes.user_id,
          });
        })
        .catch((err: AxiosError) => {
          if (err.response && err.response.status === 401) {
            setErrorDialogTitle("セッションがタイムアウトしました");
            setShowMessageDialog(true);
            setMessageDialogMessage(
              "最後のログインから一定時間が経過したためログアウトしました。再度ログインしてください。"
            );
            localStorage.removeItem("gatewayApiToken");
          } else if (err.message === "Network Error") {
            setErrorDialogTitle("サーバーからの応答がありません");
            setShowMessageDialog(true);
            setMessageDialogMessage(
              "端末のネットワーク接続を確認した上で、「ログイン出来ない場合」に記載されたステータスページを確認してください。"
            );
          } else {
            handleApiError(err, "auth_me_get");
            setMessageDialogMessage(err.message);
            setShowMessageDialog(true);
          }
          navigate("/login", { replace: true });
        });
    } else {
      // 未ログイン時ログインページへ遷移
      navigate("/login", { replace: true });
    }
  }, []);

  const handleClose = () => {
    setShowMessageDialog(false);
    setMessageDialogMessage("");
  };

  return (
    <>
      <Routes>
        <Route path="login" element={<Login />} />
        {profile ? (
          <>
            {["moderator", "executive", "exhibit"].includes(
              profile.user_type
            ) ? (
              <>
                <Route index element={<Home />} />
                <Route path="exhibit">
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
                </Route>
                <Route path="entrance">
                  {["moderator", "executive"].includes(profile.user_type) ? (
                    <>
                      <Route index element={<EntranceIndex />} />
                      <Route path="reserve-check" element={<ReserveCheck />} />
                      <Route path="enter" element={<EntranceEnter />} />
                      <Route path="exit" element={<EntranceExit />} />
                    </>
                  ) : (
                    <Route path="*" element={<Extra type="unauthorized" />} />
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
                    <Route path="*" element={<Extra type="notFound" />} />
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
                    <Route path="*" element={<Extra type="unauthorized" />} />
                  )}
                </Route>
                <Route path="*" element={<Extra type="notFound" />} />
              </>
            ) : profile.user_type === "keepout" ? (
              <Route path="*" element={<Extra type="keepout" />} />
            ) : (
              <Route path="*" element={<Extra type="unknown" />} />
            )}
          </>
        ) : (
          <Route path="*" element={<Extra type="loading" />} />
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
