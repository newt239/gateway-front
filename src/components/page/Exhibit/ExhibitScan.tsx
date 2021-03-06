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
  Tooltip,
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
  guestIdValidation,
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
  const largerThanMD = useMediaQuery(theme.breakpoints.up("md"));
  const profile = useRecoilValue(profileState);
  const token = useRecoilValue(tokenState);
  const [text, setText] = useState<string>("");
  const [scanStatus, setScanStatus] = useState<"waiting" | "success" | "error">(
    "waiting"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [guestInfo, setGuestInfo] = useState<guestInfoProp | null>(null);
  const [capacity, setCapacity] = useState(0);
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [exhibitName, setExhibitName] = useState("");
  const [lastUpdate, setLastUpdate] = useState<Moment>(moment());
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
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
      if (
        !exhibitName ||
        scanStatus === "success" ||
        moment().diff(lastUpdate) > 10000
      ) {
        apiClient(process.env.REACT_APP_API_BASE_URL)
          .exhibit.info._exhibit_id(exhibit_id)
          .$get({
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setPageInfo({ title: `${res.exhibit_name} - ${res.room_name}` });
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
          });
      }
    }
  };

  useEffect(() => {
    setAlertMessage("");
    setAlertStatus(false);
    updateExhibitInfo();
  }, [scanType]);

  const handleScan = (scanText: string | null) => {
    if (scanText && token && profile && exhibit_id) {
      setText(scanText);
      if (guestIdValidation(scanText)) {
        setDeviceState(false);
        setLoading(true);
        // ????????????????????????
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
              setAlertMessage("?????????????????????????????????");
              setAlertStatus(true);
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
                  // ???????????????????????????
                  setScanStatus("error");
                  setAlertMessage(
                    "???????????????????????????????????????????????????????????????????????????????????????????????????????????????"
                  );
                  setAlertStatus(true);
                  ReactGA.event({
                    category: "scan",
                    action: "exhibit_enter_already",
                    label: profile.user_id,
                  });
                } else {
                  // ?????????????????????????????????????????????????????????
                  const payload = {
                    guest_id: scanText,
                    exhibit_id: res.exhibit_id,
                  };
                  // ???????????????????????????
                  apiClient(process.env.REACT_APP_API_BASE_URL)
                    .activity.exit.$post({
                      headers: { Authorization: "Bearer " + token },
                      body: payload,
                    })
                    .then(() => {
                      setDeviceState(true);
                      setScanStatus("success");
                      setAlertMessage(
                        "??????????????????????????????????????????????????????????????????????????????????????????"
                      );
                      setAlertStatus(true);
                    })
                    .catch(() => {
                      setAlertMessage(
                        "?????????????????????????????????????????????????????????????????????????????????"
                      );
                      setAlertStatus(true);
                      ReactGA.event({
                        category: "scan",
                        action: "exhibit_enter_reject",
                        label: profile.user_id,
                      });
                      setDeviceState(true);
                    });
                }
              } else if (scanType === "exit") {
                if (res.exhibit_id === exhibit_id) {
                  setScanStatus("success");
                } else if (res.exhibit_id === "") {
                  setScanStatus("error");
                  setAlertMessage(
                    "????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????"
                  );
                  setAlertStatus(true);
                  ReactGA.event({
                    category: "scan",
                    action: "exhibit_exit_reject",
                    label: profile.user_id,
                  });
                } else {
                  setScanStatus("success");
                  setAlertMessage("???????????????????????????????????????????????????");
                  setAlertStatus(true);
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
            setAlertMessage("?????????????????????????????????????????????");
            setAlertStatus(true);
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
        setAlertMessage("???????????????????????????????????????");
        setAlertStatus(true);
        setSmDrawerStatus(true);
      }
    }
  };

  const retry = () => {
    setDeviceState(true);
    setText("");
    setAlertMessage("");
    setSnackbar({ status: false, message: "", severity: "success" });
    setScanStatus("waiting");
    setAlertStatus(false);
    setSmDrawerStatus(false);
  };

  const onNumPadClose = (num: number[]) => {
    if (num.length > 0) {
      handleScan("G" + num.map((n) => String(n)).join(""));
    }
  };

  const GuestInfoCard = () => {
    const registerSession = () => {
      if (token && profile && exhibit_id && guestInfo) {
        const payload = {
          guest_id: text,
          exhibit_id: exhibit_id,
        };
        if (scanType === "enter" && currentCount >= capacity) {
          setSnackbar({
            status: true,
            message: "?????????????????????????????????????????????",
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
              if (scanType === "enter") {
                setCurrentCount(currentCount + 1);
                setSnackbar({
                  status: true,
                  message: "????????????????????????????????????",
                  severity: "success",
                });
              } else if (scanType === "exit") {
                setCurrentCount(currentCount - 1);
                setSnackbar({
                  status: true,
                  message: "????????????????????????????????????",
                  severity: "success",
                });
              }
              setDeviceState(true);
              setText("");
              setAlertMessage("");
              setAlertStatus(true);
              setScanStatus("waiting");
              setSmDrawerStatus(false);
            })
            .catch((err: AxiosError) => {
              console.log(err.message);
              setSnackbar({
                status: true,
                message: "?????????????????????????????????????????????",
                severity: "error",
              });
              setAlertStatus(true);
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
                ???????????????
              </Button>
            }
          >
            {alertMessage}
          </Alert>
        )}
        {scanStatus === "success" && guestInfo && (
          <Card variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h4">???????????????</Typography>
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
                      ? "??????"
                      : guestInfo.guest_type === "family"
                      ? "?????????"
                      : "?????????"
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
                ?????????????????????
              </Button>
              <Button variant="contained" onClick={registerSession}>
                {scanType === "enter" ? "????????????" : "????????????"}
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
              ??????ID??????????????????????????????
            </Card>
          </Grid>
        </Grid>
      ) : profile &&
        profile.user_type === "exhibit" &&
        profile.user_id !== exhibit_id ? (
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ p: 2 }}>
              ?????????????????????????????????????????????????????????
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12}>
            <Grid container sx={{ alignItems: "center" }}>
              <Grid item sx={{ pr: 4 }} xs={12} sm lg={2}>
                <Typography variant="h3">
                  {scanType === "enter" ? "??????????????????" : "??????????????????"}
                </Typography>
              </Grid>
              <Grid item sx={{ pr: 2 }}>
                <Button
                  size="small"
                  startIcon={<PublishedWithChangesRoundedIcon />}
                  onClick={() =>
                    navigate(
                      `/exhibit/${exhibit_id || "unknown"}/${
                        scanType === "enter" ? "exit" : "enter"
                      }`,
                      { replace: true }
                    )
                  }
                >
                  {scanType === "enter" ? "??????????????????" : "??????????????????"}
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
                    ????????????
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
                    ???????????????
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Grid item>
                {capacity ? (
                  <Grid container spacing={2} sx={{ alignItems: "end" }}>
                    <Grid item>
                      <span style={{ fontSize: "2rem", fontWeight: 800 }}>
                        {currentCount}
                      </span>
                      <span> / {capacity} ???</span>
                    </Grid>
                    <Grid item>
                      <Tooltip
                        title={`????????????: ${lastUpdate.format("HH:mm:ss")}`}
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={updateExhibitInfo}
                        >
                          <ReplayRoundedIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                ) : (
                  <Skeleton variant="rectangular" width={250} height="100%" />
                )}
              </Grid>
              {largerThanMD && (
                <Grid item>
                  <Alert severity="info">
                    QR?????????????????????????????????????????????????????????
                  </Alert>
                </Grid>
              )}
              <Grid item>
                <NumPad scanType="guest" onClose={onNumPadClose} />
              </Grid>
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
                ?????????ID:
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
                        aria-label="?????????ID????????????"
                        onClick={() => {
                          if (text !== "") {
                            navigator.clipboard
                              .writeText(text)
                              .catch((e) => console.log(e));
                            setSnackbar({
                              status: true,
                              message: "?????????????????????",
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
            <Suspense fallback={<p>?????????...</p>}>
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
    </>
  );
};

export default ExhibitScan;
