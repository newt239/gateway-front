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
import EntranceOtherEnter from "#/components/page/Entrance/OtherEnter";
import EntranceExit from "#/components/page/Entrance/Exit";
import AdminCheckGuest from "#/components/page/Admin/CheckGuest";
import AdminLostWristband from "#/components/page/Admin/LostWristband";
import Extra from "#/components/page/Extra";
import MessageDialog from "#/components/block/MessageDialog";
import NetworkErrorDialog from "#/components/block/NetworkErrorDialog";

const Body: React.VFC = () => {
  const navigate = useNavigate();
  const token = useAtomValue(tokenAtom);
  const [profile, setProfile] = useAtom(profileAtom);
  const [showMessageDialog, setShowMessageDialog] = useState<boolean>(false);
  const [errorDialogTitle, setErrorDialogTitle] = useState<string>("");
  const [errorDialogMessage, setErrorDialogMessage] = useState<string>("");
  const [networkErrorDialogOpen, setNetworkErrorDialogOpen] =
    useState<boolean>(false);

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
            setShowMessageDialog(true);
            setErrorDialogTitle("セッションがタイムアウトしました");
            setErrorDialogMessage(
              "最後のログインから一定時間が経過したためログアウトしました。再度ログインしてください。"
            );
            localStorage.removeItem("gatewayApiToken");
          } else if (err.message === "Network Error") {
            setNetworkErrorDialogOpen(true);
          } else {
            handleApiError(err, "auth_me_get");
            setShowMessageDialog(true);
            setErrorDialogTitle("予期せぬエラーが発生しました");
            setErrorDialogMessage(err.message);
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
    setErrorDialogMessage("");
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
                  <Route path=":exhibitId">
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
                      <Route
                        path="other-enter"
                        element={<EntranceOtherEnter />}
                      />
                      <Route path="exit" element={<EntranceExit />} />
                    </>
                  ) : (
                    <Route path="*" element={<Extra type="unauthorized" />} />
                  )}
                </Route>
                <Route path="analytics">
                  {["moderator", "exhibit"].includes(profile.user_type) && (
                    <Route
                      path="exhibit/:exhibitId"
                      element={<AnalyticsExhibit />}
                    />
                  )}
                  {["moderator"].includes(profile.user_type) && (
                    <>
                      <Route index element={<AnalyticsIndex />} />
                      <Route path="summary" element={<AnalyticsSummary />} />
                    </>
                  )}
                  <Route path="*" element={<Extra type="notFound" />} />
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
      <NetworkErrorDialog
        open={networkErrorDialogOpen}
        onClose={() => setNetworkErrorDialogOpen(false)}
      />
    </>
  );
};

export default Body;
