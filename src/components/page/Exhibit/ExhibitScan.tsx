import React, { useState, useEffect, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { tokenState, profileState } from "#/recoil/user";
import { deviceState } from "#/recoil/scan";
import { pageStateSelector } from "#/recoil/page";
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
  InputAdornment,
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
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import PublishedWithChangesRoundedIcon from "@mui/icons-material/PublishedWithChangesRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";

import {
  getTimePart,
  guestIdValitation,
} from "#/components/lib/commonFunction";
import Scanner from "#/components/block/Scanner";
import { guestInfoProp } from "#/types/global";
import NumPad from "#/components/block/NumPad";

type ExhibitScanProps = {
  scanType: "enter" | "exit";
};

const ExhibitScan = ({ scanType }: ExhibitScanProps) => {
  const { exhibit_id } = useParams<{ exhibit_id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const profile = useRecoilValue(profileState);
  const token = useRecoilValue(tokenState);
  const [text, setText] = useState<string>("");
  const [scanStatus, setScanStatus] = useState<"waiting" | "success" | "error">(
    "waiting"
  );
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [guestInfo, setGuestInfo] = useState<guestInfoProp | null>(null);
  const [capacity, setCapacity] = useState(0);
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [exhibitName, setExhibitName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [lastUpdate, setLastUpdate] = useState<Moment>(moment());
  const [alertStatus, setAlertStatus] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    status: boolean;
    message: string;
    severity: "success" | "error";
  }>({ status: false, message: "", severity: "success" });
  const [smDrawerOpen, setSmDrawerStatus] = useState(false);

  const setDeviceState = useSetRecoilState(deviceState);

  const setPageInfo = useSetRecoilState(pageStateSelector);
  const updateExhibitInfo = () => {
    if (token && profile && exhibit_id) {
      if (!exhibitName || moment().diff(lastUpdate) > 30000) {
        apiClient(process.env.REACT_APP_API_BASE_URL)
          .exhibit.info._exhibit_id(exhibit_id)
          .$get({
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setPageInfo({ title: res.exhibit_name });
            setCapacity(res.capacity);
            setCurrentCount(res.current);
            setExhibitName(res.exhibit_name);
            setRoomName(res.room_name);
            setLastUpdate(moment());
            ReactGA.event({
              category: "scan",
              action: "exhibit_info_request",
              label: profile.user_id,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  useEffect(() => {
    updateExhibitInfo();
  }, []);

  const handleScan = (scanText: string | null) => {
    if (scanText && token && exhibit_id) {
      setText(scanText);
      if (guestIdValitation(scanText)) {
        setDeviceState(false);
        setLoading(true);
        apiClient(process.env.REACT_APP_API_BASE_URL)
          .guest.info._guest_id(scanText)
          .$get({
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            console.log(res);
            setGuestInfo(res);
            if (!res.available) {
              setScanStatus("error");
              setMessage("このゲストは無効です。");
              setAlertStatus(true);
            } else {
              if (profile) {
                if (scanType === "enter") {
                  if (res.exhibit_id === "") {
                    setScanStatus("success");
                  } else if (res.exhibit_id === exhibit_id) {
                    setScanStatus("error");
                    setMessage(
                      "このゲストはすでにこの展示に入室中です。退室スキャンと間違えていませんか？"
                    );
                    setAlertStatus(true);
                  } else {
                    // 前の展示で退場処理が行われていない場合
                    const payload = {
                      guest_id: text,
                      exhibit_id: exhibit_id,
                    };
                    apiClient(process.env.REACT_APP_API_BASE_URL)
                      .activity.exit.$post({
                        headers: { Authorization: "Bearer " + token },
                        body: payload,
                      })
                      .then(() => {
                        setDeviceState(true);
                      })
                      .catch((err: AxiosError) => {
                        if (err.message) {
                          setSnackbar({
                            status: true,
                            message: err.message,
                            severity: "error",
                          });
                        } else {
                          setSnackbar({
                            status: true,
                            message:
                              "前の展示の退場処理に際し何らかのエラーが発生しました。",
                            severity: "error",
                          });
                          setAlertStatus(true);
                        }
                        setText("");
                        setDeviceState(true);
                        setSmDrawerStatus(false);
                      });
                  }
                } else if (scanType === "exit") {
                  if (res.exhibit_id === exhibit_id) {
                    setScanStatus("success");
                  } else if (res.exhibit_id === "") {
                    setScanStatus("error");
                    setMessage(
                      "このゲストは現在この展示に入室していません。入室スキャンと間違えていませんか？"
                    );
                    setAlertStatus(true);
                  } else {
                    setScanStatus("success");
                    setMessage("このゲストは他の展示に入室中です。");
                    setAlertStatus(true);
                  }
                }
              }
            }
            setSmDrawerStatus(true);
          })
          .catch((err: AxiosError) => {
            console.log(err);
            setScanStatus("error");
            setMessage("予期せぬエラーが発生しました。");
            setAlertStatus(true);
          });
        setLoading(false);
      } else {
        setScanStatus("error");
        setMessage("このゲストは存在しません。");
        setAlertStatus(true);
        setSmDrawerStatus(true);
      }
    }
  };

  const retry = () => {
    setDeviceState(true);
    setText("");
    setMessage("");
    setSnackbar({ status: false, message: "", severity: "success" });
    setScanStatus("waiting");
    setAlertStatus(false);
    setSmDrawerStatus(false);
  };

  const onNumPadClose = (num: number[]) => {
    handleScan(num.map(n => String(n)).join(""));
  };

  const GuestInfoCard = () => {
    const postApi = () => {
      if (profile && guestInfo && token && exhibit_id) {
        const payload = {
          guest_id: text,
          exhibit_id: exhibit_id,
        };
        updateExhibitInfo();
        if (scanType === "enter" && currentCount >= capacity) {
          setSnackbar({
            status: true,
            message: "滞在者数が上限に達しています。",
            severity: "error",
          });
          setAlertStatus(true);
        } else {
          apiClient(process.env.REACT_APP_API_BASE_URL)
            .activity[scanType].$post({
              headers: { Authorization: "Bearer " + token },
              body: payload,
            })
            .then(() => {
              setCurrentCount(currentCount + 1);
              setDeviceState(true);
              setText("");
              setMessage("");
              setSnackbar({
                status: true,
                message: "処理が完了しました。",
                severity: "success",
              });
              setAlertStatus(true);
              setScanStatus("waiting");
              setSmDrawerStatus(false);
            })
            .catch((err: AxiosError) => {
              if (err.message) {
                setSnackbar({
                  status: true,
                  message: err.message,
                  severity: "error",
                });
                setAlertStatus(true);
              } else {
                setSnackbar({
                  status: true,
                  message: "何らかのエラーが発生しました。",
                  severity: "error",
                });
                setAlertStatus(true);
              }
              setText("");
              setDeviceState(true);
              setSmDrawerStatus(false);
            });
        }
      }
    };

    return (
      <>
        {alertStatus && (
          <Alert
            variant="filled"
            severity="error"
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
            {message}
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
              <Button variant="outlined" onClick={retry}>
                スキャンし直す
              </Button>
              <Button variant="contained" onClick={postApi}>
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
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ p: 2 }}>
              展示IDが正しくありません。
            </Card>
          </Grid>
        </Grid>
      ) : profile &&
        profile.user_type === "exhibit" &&
        profile.user_id !== exhibit_id ? (
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ p: 2 }}>
              このページを表示する権限がありません。
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12}>
            <Grid container sx={{ alignItems: "center" }}>
              <Grid item sx={{ pr: 4 }} xs={12} sm lg={2}>
                <Typography variant="h3">
                  {scanType === "enter" ? "入室スキャン" : "退室スキャン"}
                </Typography>
              </Grid>
              <Grid item sx={{ pr: 2 }}>
                <Button
                  size="small"
                  startIcon={<PublishedWithChangesRoundedIcon />}
                  onClick={() =>
                    navigate(
                      `/exhibit/${exhibit_id || "unknown"}/${scanType === "enter" ? "exit" : "enter"
                      }`,
                      { replace: true }
                    )
                  }
                >
                  {scanType === "enter" ? "退室スキャン" : "入室スキャン"}
                </Button>
              </Grid>
              {profile && profile.user_type === "exhibit" && (
                <Grid item>
                  <Button
                    size="small"
                    startIcon={<BarChartRoundedIcon />}
                    onClick={() =>
                      navigate(`/chart/exhibit/${exhibit_id}`, {
                        replace: true,
                      })
                    }
                  >
                    滞在状況
                  </Button>
                </Grid>
              )}
              {profile && profile.user_type !== "exhibit" && (
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
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  {capacity ? (
                    <Grid
                      container
                      spacing={2}
                      sx={{ p: 2, alignItems: "end" }}
                    >
                      <Grid item>
                        <span style={{ fontSize: "2rem", fontWeight: 800 }}>
                          {currentCount}
                        </span>
                        <span> / {capacity} 人</span>
                      </Grid>
                      <Grid item>
                        <Button
                          size="small"
                          startIcon={<ReplayRoundedIcon />}
                          onClick={updateExhibitInfo}
                        >
                          {lastUpdate.format("HH:mm:ss")}現在
                        </Button>
                      </Grid>
                    </Grid>
                  ) : (
                    <Skeleton variant="rectangular" width={250} height="100%" />
                  )}
                </Card>
              </Grid>
              {matches && (
                <Grid item>
                  <Card variant="outlined" sx={{ height: "100%" }}>
                    {exhibitName && roomName ? (
                      <Box sx={{ p: 2 }}>
                        <div style={{ fontWeight: 600 }}>{exhibitName}</div>
                        <div>- {roomName}</div>
                      </Box>
                    ) : (
                      <Skeleton
                        variant="rectangular"
                        width={200}
                        height="100%"
                      />
                    )}
                  </Card>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} md={5}>
            <Scanner handleScan={handleScan} />
          </Grid>
          <Grid item xs={12} md={7} xl={5}>
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
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="ゲストIDをコピー"
                        onClick={() => {
                          if (text !== "") {
                            navigator.clipboard
                              .writeText(text)
                              .catch((e) => console.log(e));
                            setSnackbar({
                              status: true,
                              message: "コピーしました",
                              severity: "success",
                            });
                          }
                        }}
                        edge="end"
                      >
                        <ContentCopyRoundedIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                  disabled
                  fullWidth
                />
              </FormControl>
            </Box>
            <Suspense fallback={<p>読込中...</p>}>
              {loading && (
                <Box sx={{ width: "100%" }}>
                  <LinearProgress />
                </Box>
              )}
              {scanStatus !== "waiting" &&
                (matches ? (
                  <GuestInfoCard />
                ) : (
                  <SwipeableDrawer
                    anchor="bottom"
                    open={smDrawerOpen}
                    onClose={() => retry()}
                    onOpen={() => setSmDrawerStatus(true)}
                  >
                    <GuestInfoCard />
                  </SwipeableDrawer>
                ))}
            </Suspense>
          </Grid>
          <Snackbar
            open={snackbar.status}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            autoHideDuration={6000}
            onClose={() =>
              setSnackbar({ status: false, message: "", severity: "success" })
            }
          >
            <Alert variant="filled" severity={snackbar.severity}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Grid>
      )}
      <NumPad scanType="guest" onClose={onNumPadClose} />
    </>
  );
};

export default ExhibitScan;
