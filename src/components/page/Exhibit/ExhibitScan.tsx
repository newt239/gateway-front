import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAtomValue, useSetAtom } from "jotai";
import {
  tokenAtom,
  profileAtom,
  pageTitleAtom,
  deviceStateAtom,
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
  FormControl,
  IconButton,
  OutlinedInput,
  Box,
  LinearProgress,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Skeleton,
  Tooltip,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
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
} from "#/components/lib/commonFunction";
import Scanner from "#/components/block/Scanner";
import { guestInfoProp } from "#/components/lib/types";
import NumPad from "#/components/block/NumPad";
import ScanGuide from "#/components/block/ScanGuide";

type ExhibitScanProps = {
  scanType: "enter" | "exit";
};

const ExhibitScan = ({ scanType }: ExhibitScanProps) => {
  const pathMatchResult = useLocation().pathname.match(/exhibit\/(.*)\//);
  const exhibit_id = pathMatchResult && pathMatchResult[1];
  const navigate = useNavigate();
  const theme = useTheme();
  const largerThanMD = useMediaQuery(theme.breakpoints.up("md"));
  const profile = useAtomValue(profileAtom);
  const token = useAtomValue(tokenAtom);
  const [text, setText] = useState<string>("");
  const [scanStatus, setScanStatus] = useState<"waiting" | "success" | "error">(
    "waiting"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [guestInfo, setGuestInfo] = useState<guestInfoProp | null>(null);
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
  const [smDrawerOpen, setSmDrawerStatus] = useState<boolean>(false);
  const [showScanGuide, setShowScanGuide] = useState<boolean>(true);
  const setDeviceState = useSetAtom(deviceStateAtom);

  const setPageTitle = useSetAtom(pageTitleAtom);
  const updateExhibitInfo = () => {
    setPageTitle("入退室スキャン");
    if (token && profile && exhibit_id) {
      if (
        !exhibitName ||
        scanStatus === "success" ||
        moment().diff(lastUpdate) > 10000
      ) {
        setExhibitInfoLoading(true);
        apiClient(process.env.REACT_APP_API_BASE_URL)
          .exhibit.info._exhibit_id(exhibit_id)
          .$get({
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setPageTitle(`${res.exhibit_name} - ${res.room_name}`);
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
    setAlertMessage(null);
    updateExhibitInfo();
    setShowScanGuide(true);
    setGuideMessage("来場者のQRコードを水平にかざしてください");
  }, [scanType]);

  const handleScan = (scanText: string | null) => {
    if (scanText && token && profile && exhibit_id) {
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
                  setScanStatus("success");
                  ReactGA.event({
                    category: "scan",
                    action: "exhibit_success",
                    label: profile.user_id,
                  });
                } else if (res.exhibit_id === exhibit_id) {
                  // すでに入室中の場合
                  setScanStatus("error");
                  setAlertMessage(
                    "このゲストはすでにこの展示に入室中です。退室スキャンと間違えていませんか？"
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
                    .catch(() => {
                      setAlertMessage(
                        "前の展示の退場処理に際し何らかのエラーが発生しました。"
                      );
                      ReactGA.event({
                        category: "scan",
                        action: "exhibit_enter_reject",
                        label: profile.user_id,
                      });
                      setDeviceState(true);
                    });
                }
                if (scanType === "enter" && currentCount >= capacity) {
                  // すでにエラーメッセージがある場合はそのメッセージの後ろに追記
                  setAlertMessage((message) =>
                    message ? message : "" + "滞在者数が上限に達しています。"
                  );
                  ReactGA.event({
                    category: "scan",
                    action: "reach_capacity",
                    label: profile.user_id,
                  });
                }
              } else if (scanType === "exit") {
                if (res.exhibit_id === exhibit_id) {
                  setScanStatus("success");
                } else if (res.exhibit_id === "") {
                  setScanStatus("error");
                  setAlertMessage(
                    "このゲストは現在どの展示にも入室していません。入室スキャンと間違えていませんか？"
                  );
                  ReactGA.event({
                    category: "scan",
                    action: "exhibit_exit_reject",
                    label: profile.user_id,
                  });
                } else {
                  setScanStatus("success");
                  setAlertMessage("このゲストは他の展示に入室中です。");
                  ReactGA.event({
                    category: "scan",
                    action: "exhibit_exit_already_other",
                    label: profile.user_id,
                  });
                }
              }
            }
            setSmDrawerStatus(true);
          })
          .catch((err: AxiosError) => {
            console.log(err);
            setScanStatus("error");
            setAlertMessage("予期せぬエラーが発生しました。");
            ReactGA.event({
              category: "scan",
              action: "exhibit_unknown_error",
              label: err.message,
            });
          })
          .finally(() => {
            updateExhibitInfo();
            setLoading(false);
          });
      } else {
        setScanStatus("error");
        setAlertMessage("このゲストは存在しません。");
        setSmDrawerStatus(true);
      }
    }
  };

  useEffect(() => {
    if (scanStatus === "success") {
      setGuideMessage(
        `情報を確認し、問題がなければ${scanType === "enter" ? "入室記録" : "退室記録"
        }を押してください`
      );
    }
  }, [scanStatus]);

  const retry = () => {
    setDeviceState(true);
    setText("");
    setAlertMessage(null);
    setSnackbarMessage(null);
    setScanStatus("waiting");
    setSmDrawerStatus(false);
    setShowScanGuide(true);
  };

  const onNumPadClose = (num: number[]) => {
    if (num.length > 0) {
      handleScan("G" + num.map((n) => String(n)).join(""));
      if (profile) {
        ReactGA.event({
          category: "numpad",
          action: "exhibit_use_numpad",
          label: profile.user_id,
        });
      }
    }
  };

  const GuestInfoCard = () => {
    const registerSession = () => {
      if (token && profile && exhibit_id && guestInfo) {
        const payload = {
          guest_id: text,
          exhibit_id: exhibit_id,
        };
        apiClient(process.env.REACT_APP_API_BASE_URL)
          .activity[scanType].$post({
            headers: { Authorization: "Bearer " + token },
            body: payload,
          })
          .then(() => {
            if (scanType === "enter") {
              setCurrentCount(currentCount + 1);
              setSnackbarMessage("入室処理が完了しました。");
            } else if (scanType === "exit") {
              setCurrentCount(currentCount - 1);
              setSnackbarMessage("退室処理が完了しました。");
            }
            setDeviceState(true);
            setText("");
            setAlertMessage(null);
            setScanStatus("waiting");
            setSmDrawerStatus(false);
            setGuideMessage(
              "処理が完了しました。次の来場者のスキャンができます"
            );
          })
          .catch((err: AxiosError) => {
            console.log(err.message);
            setAlertMessage(`何らかのエラーが発生しました。${err.message}`);
            setText("");
            setDeviceState(true);
            setSmDrawerStatus(false);
            setGuideMessage("来場者のQRコードを水平にかざしてください");
          })
          .finally(() => {
            setShowScanGuide(true);
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
            action={
              <Button
                color="inherit"
                sx={{
                  whiteSpace: "nowrap",
                }}
                onClick={retry}
              >
                再スキャン
              </Button>
            }
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
                justifyContent: "flex-end",
                alignItems: "flex-end",
                gap: "1rem",
              }}
            >
              <Button
                variant="outlined"
                color="error"
                onClick={retry}
                startIcon={<ReplayRoundedIcon />}
              >
                スキャンし直す
              </Button>
              <Button variant="contained" onClick={registerSession}>
                {scanType === "enter" ? "入室記録" : "退室記録"}
              </Button>
            </Box>
          </Card>
        )}
      </>
    );
  };

  return (
    <>
      {!exhibit_id ? (
        <Grid container spacing={2} sx={{ py: 2 }}>
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ p: 2 }}>
              展示IDが正しくありません。
            </Card>
          </Grid>
        </Grid>
      ) : profile &&
        profile.user_type === "exhibit" &&
        profile.user_id !== exhibit_id ? (
        <Grid container spacing={2} sx={{ py: 2 }}>
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ p: 2 }}>
              このページを表示する権限がありません。
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          spacing={2}
          sx={{ py: 2, justifyContent: "space-evenly" }}
        >
          <Grid item xs={12}>
            <Grid container sx={{ alignItems: "center", gap: "1rem" }}>
              <Grid item sx={{ pr: 4 }} xs>
                <Typography variant="h3">
                  {scanType === "enter" ? "入室スキャン" : "退室スキャン"}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  size="small"
                  startIcon={<PublishedWithChangesRoundedIcon />}
                  onClick={() =>
                    navigate(
                      `/exhibit/${exhibit_id || "unknown"}/${scanType === "enter" ? "exit" : "enter"
                      } `,
                      { replace: true }
                    )
                  }
                >
                  {scanType === "enter" ? "退室スキャン" : "入室スキャン"}
                </Button>
              </Grid>
              {profile && ["moderator", "exhibit"].includes(profile.user_type) && (
                <Grid item>
                  <Button
                    size="small"
                    startIcon={<BarChartRoundedIcon />}
                    onClick={() =>
                      navigate(`/analytics/exhibit/${exhibit_id}`, {
                        replace: true,
                      })
                    }
                  >
                    滞在状況
                  </Button>
                </Grid>
              )}
              {profile &&
                ["moderator", "executive"].includes(profile.user_type) && (
                  <Grid item>
                    <Button
                      size="small"
                      startIcon={<ArrowBackIosNewRoundedIcon />}
                      onClick={() => navigate("/exhibit", { replace: true })}
                    >
                      一覧に戻る
                    </Button>
                  </Grid>
                )}
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ mb: largerThanMD ? 3 : 0 }}>
            <Grid
              container
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "nowrap",
              }}
            >
              <Grid item>
                {capacity ? (
                  <Grid
                    container
                    spacing={2}
                    sx={{ alignItems: "end", flexWrap: "nowrap" }}
                  >
                    <Grid item>
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
                    </Grid>
                    <Grid item>
                      <Tooltip
                        title={`最終更新: ${lastUpdate.format("HH:mm:ss")} `}
                      >
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
                    </Grid>
                  </Grid>
                ) : (
                  <Skeleton variant="rectangular" width={250} height="100%" />
                )}
              </Grid>
              {largerThanMD && (
                <Grid item sx={{ maxWidth: "70%" }}>
                  <Alert severity="info">{guideMessage}</Alert>
                </Grid>
              )}
              <Grid item>
                <NumPad scanType="guest" onClose={onNumPadClose} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md="auto">
            <Scanner handleScan={handleScan} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h4" sx={{ whiteSpace: "noWrap" }}>
                ゲストID:
              </Typography>
              <FormControl sx={{ m: 1, flexGrow: 1 }} variant="outlined">
                <OutlinedInput
                  type="text"
                  size="small"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled
                  fullWidth
                />
              </FormControl>
            </Box>
            {loading && (
              <Box sx={{ width: "100%" }}>
                <LinearProgress />
              </Box>
            )}
            {scanStatus !== "waiting" &&
              (largerThanMD ? (
                <GuestInfoCard />
              ) : (
                <SwipeableDrawer
                  anchor="bottom"
                  open={smDrawerOpen}
                  onClose={retry}
                  onOpen={() => setSmDrawerStatus(true)}
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
