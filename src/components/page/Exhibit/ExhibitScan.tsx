import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAtomValue, useSetAtom } from "jotai";
import {
  tokenAtom,
  profileAtom,
  deviceStateAtom,
  pageTitleAtom,
} from "#/components/lib/jotai";
import ReactGA from "react-ga4";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";
import moment, { Moment } from "moment";

import {
  Alert,
  SwipeableDrawer,
  Grid,
  Typography,
  Button,
  IconButton,
  Box,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import PublishedWithChangesRoundedIcon from "@mui/icons-material/PublishedWithChangesRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";

import {
  getTimePart,
  guestIdValidation,
  handleApiError,
} from "#/components/lib/commonFunction";
import Scanner from "#/components/block/Scanner";
import { GuestInfoProps } from "#/components/lib/types";
import useDeviceWidth from "#/components/lib/useDeviceWidth";
import NumPad from "#/components/block/NumPad";
import ScanGuide from "#/components/block/ScanGuide";

const ExhibitScan: React.VFC<{ scanType: "enter" | "exit" }> = ({
  scanType,
}) => {
  const setTitle = useSetAtom(pageTitleAtom);
  const { exhibitId } = useParams() as { exhibitId: string };
  const navigate = useNavigate();
  const { largerThanSM, largerThanMD } = useDeviceWidth();
  const profile = useAtomValue(profileAtom);
  const token = useAtomValue(tokenAtom);
  const [text, setText] = useState<string>("");
  const [scanStatus, setScanStatus] = useState<"waiting" | "success" | "error">(
    "waiting"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);
  const [guestInfo, setGuestInfo] = useState<GuestInfoProps | null>(null);
  const [capacity, setCapacity] = useState<number>(0);
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [exhibitName, setExhibitName] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Moment>(moment());
  const [exhibitInfoLoading, setExhibitInfoLoading] = useState<boolean>(true);
  const [guideMessage, setGuideMessage] = useState<string>(
    "来場者のQRコードをカメラに水平にかざしてください"
  );
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [smDrawerOpen, setSMDrawerStatus] = useState<boolean>(false);
  const [showScanGuide, setShowScanGuide] = useState<boolean>(true);
  const setDeviceState = useSetAtom(deviceStateAtom);

  const updateExhibitInfo = () => {
    if (token && profile) {
      // 初期ロード時 or 処理完了直後 or 最終取得から10秒以上経過後
      if (
        !exhibitName ||
        scanStatus === "success" ||
        moment().diff(lastUpdate) > 10000
      ) {
        setExhibitInfoLoading(true);
        apiClient(process.env.REACT_APP_API_BASE_URL)
          .exhibit.info._exhibit_id(exhibitId)
          .$get({
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setTitle(`${res.exhibit_name} - ${res.room_name}`);
            setCapacity(res.capacity);
            setCurrentCount(res.current);
            setExhibitName(res.exhibit_name);
            setLastUpdate(moment());
            ReactGA.event({
              category: "scan",
              action: "exhibit_info_request",
              label: profile.user_id,
            });
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setExhibitInfoLoading(false);
          });
      }
    }
  };

  useEffect(() => {
    reset();
    updateExhibitInfo();
  }, [scanType]);

  const handleScan = (scanText: string | null) => {
    if (scanText && scanText !== text && token && profile) {
      setAlertMessage(null);
      setText(scanText);
      setShowScanGuide(false);
      if (guestIdValidation(scanText)) {
        setDeviceState(false);
        setLoading(true);
        // ゲスト情報を取得
        apiClient(process.env.REACT_APP_API_BASE_URL)
          .guest.info._guest_id(scanText)
          .$get({
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setGuestInfo(res);
            if (!res.available) {
              setScanStatus("error");
              setAlertMessage("このゲストは無効です。");
            } else {
              if (scanType === "enter") {
                if (res.exhibit_id === "") {
                  // 正常な入室処理
                  setScanStatus("success");
                  ReactGA.event({
                    category: "scan",
                    action: "exhibit_success",
                    label: profile.user_id,
                  });
                } else if (res.exhibit_id === exhibitId) {
                  // すでに該当の展示に入室中の場合
                  setScanStatus("error");
                  setAlertMessage(
                    `このゲストはすでに${
                      exhibitName ? `「${exhibitName}」` : "この展示"
                    }に入室中です。退室スキャンと間違えていませんか？`
                  );
                  ReactGA.event({
                    category: "scan",
                    action: "exhibit_enter_already",
                    label: profile.user_id,
                  });
                } else {
                  // 前の展示で退場処理が行われていない場合
                  const payload = {
                    guest_id: scanText,
                    exhibit_id: res.exhibit_id,
                  };
                  // 前の展示の退室処理
                  apiClient(process.env.REACT_APP_API_BASE_URL)
                    .activity.exit.$post({
                      headers: { Authorization: "Bearer " + token },
                      body: payload,
                    })
                    .then(() => {
                      setDeviceState(true);
                      setScanStatus("success");
                      setAlertMessage(
                        "前の展示で退室処理が行われていなかったため退室処理しました。"
                      );
                    })
                    .catch((innerErr: AxiosError) => {
                      handleApiError(innerErr, "activity_exit_post");
                      setAlertMessage(
                        "前の展示で退室処理が行われていなかったため退室処理しようとしましたが、何らかのエラーが発生しました。"
                      );
                      ReactGA.event({
                        category: "scan",
                        action: "exhibit_enter_reject",
                        label: profile.user_id,
                      });
                      setDeviceState(true);
                    });
                }
                if (currentCount >= capacity) {
                  // すでにエラーメッセージがある場合はそのメッセージの後ろに追記
                  setAlertMessage(
                    (message) =>
                      (message ? message + "また、" : "") +
                      "滞在者数が設定された上限人数に達しています。"
                  );
                  ReactGA.event({
                    category: "scan",
                    action: "reach_capacity",
                    label: profile.user_id,
                  });
                }
              } else if (scanType === "exit") {
                if (res.exhibit_id === exhibitId) {
                  // 正常な退室処理
                  setScanStatus("success");
                } else if (res.exhibit_id === "") {
                  // どこの展示にも入室していない
                  setScanStatus("error");
                  setAlertMessage(
                    `このゲストの${
                      exhibitName ? `「${exhibitName}」` : "この展示"
                    }への入室記録がありません。入室スキャンと間違えていませんか？`
                  );
                  ReactGA.event({
                    category: "scan",
                    action: "exhibit_exit_reject",
                    label: profile.user_id,
                  });
                } else {
                  // 別の展示に入室中
                  setScanStatus("success");
                  setAlertMessage(
                    `このゲストは他の展示に入室中です。まずは${
                      exhibitName ? `「${exhibitName}」` : "この展示"
                    }への入室スキャンをしてください。`
                  );
                  ReactGA.event({
                    category: "scan",
                    action: "exhibit_exit_already_other",
                    label: profile.user_id,
                  });
                }
              }
              updateExhibitInfo();
            }
          })
          .catch((err: AxiosError) => {
            handleApiError(err, "guest_info_get");
            setScanStatus("error");
            setAlertMessage("予期せぬエラーが発生しました。");
            ReactGA.event({
              category: "scan",
              action: "exhibit_unknown_error",
              label: err.message,
            });
          })
          .finally(() => {
            setSMDrawerStatus(true);
            setLoading(false);
          });
      } else if (scanText.endsWith("=")) {
        setScanStatus("error");
        setAlertMessage(
          "これは予約用QRコードです。リストバンドのQRコードをスキャンしてください。"
        );
        setSMDrawerStatus(true);
      } else {
        setScanStatus("error");
        setAlertMessage("このゲストは存在しません。");
        setSMDrawerStatus(true);
      }
    }
  };

  useEffect(() => {
    if (scanStatus === "success") {
      setGuideMessage(
        `情報を確認し、問題がなければ${
          scanType === "enter" ? "入室記録" : "退室記録"
        }を押してください`
      );
    }
  }, [scanStatus]);

  const reset = () => {
    setDeviceState(true);
    setText("");
    setGuestInfo(null);
    setAlertMessage(null);
    setSnackbarMessage(null);
    setScanStatus("waiting");
    setSMDrawerStatus(false);
    setShowScanGuide(true);
    setGuideMessage("来場者のQRコードをカメラに水平にかざしてください");
  };

  const onNumPadClose = (num: number[]) => {
    if (num.length > 0) {
      handleScan("G" + num.map((n) => String(n)).join(""));
      ReactGA.event({
        category: "numpad",
        action: "exhibit_use_numpad",
        label: profile?.user_id,
      });
    }
  };

  const GuestInfoCard: React.VFC = () => {
    const registerSession = () => {
      if (token && profile && guestInfo) {
        setRegisterLoading(true);
        const payload = {
          guest_id: text,
          exhibit_id: exhibitId,
        };
        apiClient(process.env.REACT_APP_API_BASE_URL)
          .activity[scanType].$post({
            headers: { Authorization: "Bearer " + token },
            body: payload,
          })
          .then(() => {
            if (scanType === "enter") {
              setCurrentCount((current) => current + 1);
              setSnackbarMessage("入室処理が完了しました。");
            } else if (scanType === "exit") {
              setCurrentCount((current) => current - 1);
              setSnackbarMessage("退室処理が完了しました。");
            }
            setAlertMessage(null);
            setScanStatus("waiting");
            setGuideMessage(
              "処理が完了しました。次の来場者のスキャンができます"
            );
          })
          .catch((err: AxiosError) => {
            handleApiError(err, "activity_post");
            setAlertMessage(`何らかのエラーが発生しました。${err.message}`);
            setGuideMessage("来場者のQRコードを水平にかざしてください");
          })
          .finally(() => {
            setText("");
            setDeviceState(true);
            setSMDrawerStatus(false);
            setShowScanGuide(true);
            setRegisterLoading(false);
          });
      }
    };

    return (
      <>
        {alertMessage && (
          <Alert
            variant="filled"
            severity="error"
            sx={{ my: 1, mx: !largerThanMD ? 1 : 0 }}
            onClose={reset}
          >
            {alertMessage}
          </Alert>
        )}
        {scanStatus === "success" && guestInfo && (
          <Card variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h4">ゲスト情報</Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <PersonRoundedIcon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PeopleRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    guestInfo.guest_type === "student"
                      ? "生徒"
                      : guestInfo.guest_type === "teacher"
                      ? "教員"
                      : guestInfo.guest_type === "family"
                      ? "保護者"
                      : "その他"
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AccessTimeRoundedIcon />
                </ListItemIcon>
                <ListItemText primary={getTimePart(guestInfo.part).part_name} />
              </ListItem>
            </List>
            <Box
              m={1}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                variant="outlined"
                color="error"
                onClick={reset}
                startIcon={<ReplayRoundedIcon />}
              >
                スキャンし直す
              </Button>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                }}
              >
                {registerLoading && (
                  <CircularProgress size={25} thickness={6} />
                )}
                <Button
                  variant="contained"
                  onClick={registerSession}
                  disabled={registerLoading}
                >
                  {scanType === "enter" ? "入室記録" : "退室記録"}
                </Button>
              </Box>
            </Box>
          </Card>
        )}
      </>
    );
  };

  return (
    <>
      {profile?.user_type === "exhibit" && profile?.user_id !== exhibitId ? (
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ p: 2 }}>
              このページを表示する権限がありません。
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2} sx={{ justifyContent: "space-evenly" }}>
          <Grid item xs={12}>
            <Grid container spacing={2} sx={{ alignItems: "center" }}>
              <Grid item>
                <Typography variant="h3">
                  {scanType === "enter" ? "入室スキャン" : "退室スキャン"}
                </Typography>
              </Grid>
              <Grid
                item
                flexGrow={1}
                xs={12}
                sm
                sx={{
                  width: "100%",
                  display: "flex",
                  overflowX: "scroll",
                  flexDirection: "row",
                  justifyContent: largerThanSM ? "flex-end" : "flex-start",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                  p: 0,
                  pb: largerThanSM ? 0 : 1,
                }}
              >
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    startIcon={<PublishedWithChangesRoundedIcon />}
                    onClick={() =>
                      navigate(
                        `/exhibit/${exhibitId || "unknown"}/${
                          scanType === "enter" ? "exit" : "enter"
                        } `,
                        { replace: true }
                      )
                    }
                  >
                    {scanType === "enter" ? "退室スキャン" : "入室スキャン"}
                  </Button>
                  {profile &&
                    ["moderator", "exhibit"].includes(profile.user_type) && (
                      <Button
                        startIcon={<BarChartRoundedIcon />}
                        onClick={() =>
                          navigate(`/analytics/exhibit/${exhibitId}`, {
                            replace: true,
                          })
                        }
                      >
                        滞在状況
                      </Button>
                    )}
                  {profile &&
                    ["moderator", "executive"].includes(profile.user_type) && (
                      <Button
                        startIcon={<ArrowBackIosNewRoundedIcon />}
                        onClick={() => navigate("/exhibit", { replace: true })}
                      >
                        一覧に戻る
                      </Button>
                    )}
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ mb: largerThanMD ? 3 : 0 }}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "nowrap",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "end",
                  flexWrap: "nowrap",
                }}
              >
                {capacity !== 0 && (
                  <>
                    <Box sx={{ whiteSpace: "nowrap" }}>
                      <span
                        style={{
                          fontSize: "2rem",
                          fontWeight: 800,
                          color: currentCount >= capacity ? "red" : "black",
                        }}
                      >
                        {currentCount}
                      </span>
                      <span> / {capacity} 人</span>
                    </Box>
                    <Box>
                      <Tooltip title={`${lastUpdate.format("HH:mm:ss")}現在`}>
                        <span>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={updateExhibitInfo}
                            disabled={exhibitInfoLoading}
                          >
                            <ReplayRoundedIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </>
                )}
              </Box>
              {largerThanSM && (
                <Alert severity="info" sx={{ flexGrow: 1 }}>
                  {guideMessage}
                </Alert>
              )}
              <NumPad scanType="guest" onClose={onNumPadClose} />
            </Box>
          </Grid>
          <Grid item xs={12} md="auto">
            <Scanner handleScan={handleScan} />
          </Grid>
          <Grid item xs={12} md={6} lg={5}>
            <Box
              sx={{
                mb: 2,
                px: 1,
                borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                width: "100%",
                display: "flex",
                flextWrap: "nowrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h4" sx={{ py: 1 }}>
                ゲストID: {text}
              </Typography>
              {loading && <CircularProgress size={30} thickness={6} />}
            </Box>
            {scanStatus !== "waiting" &&
              (largerThanMD ? (
                <GuestInfoCard />
              ) : (
                <SwipeableDrawer
                  anchor="bottom"
                  open={smDrawerOpen}
                  onClose={reset}
                  onOpen={() => setSMDrawerStatus(true)}
                  sx={{ transform: "translateZ(3px)" }}
                >
                  <GuestInfoCard />
                </SwipeableDrawer>
              ))}
          </Grid>
        </Grid>
      )}
      <Snackbar
        open={snackbarMessage !== null}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        autoHideDuration={6000}
        onClose={() => setSnackbarMessage(null)}
      >
        <Alert variant="filled" severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <ScanGuide show={showScanGuide} />
    </>
  );
};

export default ExhibitScan;
