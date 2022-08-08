import React, { useEffect, useState } from "react";
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

import {
  Alert,
  SwipeableDrawer,
  Grid,
  Typography,
  Button,
  FormControl,
  OutlinedInput,
  Box,
  LinearProgress,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import GroupWorkRoundedIcon from "@mui/icons-material/GroupWorkRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";

import { guestInfoProp } from "#/components/lib/types";
import {
  getTimePart,
  guestIdValidation,
} from "#/components/lib/commonFunction";
import Scanner from "#/components/block/Scanner";
import NumPad from "#/components/block/NumPad";
import ScanGuide from "#/components/block/ScanGuide";

const EntranceExit = () => {
  const theme = useTheme();
  const largerThanSM = useMediaQuery(theme.breakpoints.up("sm"));
  const token = useAtomValue(tokenAtom);
  const profile = useAtomValue(profileAtom);
  const [text, setText] = useState<string>("");
  const [scanStatus, setScanStatus] = useState<"waiting" | "success" | "error">(
    "waiting"
  );
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [guestInfo, setGuestInfo] = useState<guestInfoProp | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [smDrawerOpen, setSmDrawerStatus] = useState<boolean>(false);
  const [showScanGuide, setShowScanGuide] = useState<boolean>(true);

  const setDeviceState = useSetAtom(deviceStateAtom);

  const setPageTitle = useSetAtom(pageTitleAtom);
  useEffect(() => {
    setPageTitle("エントランス");
  }, []);

  const handleScan = (scanText: string | null) => {
    if (token && scanText) {
      setText(scanText);
      setShowScanGuide(false);
      if (guestIdValidation(scanText)) {
        setDeviceState(false);
        setLoading(true);
        apiClient(process.env.REACT_APP_API_BASE_URL)
          .guest.info._guest_id(scanText)
          .$get({
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setLoading(false);
            setGuestInfo(res);
            if (res.available) {
              setScanStatus("success");
              setSmDrawerStatus(true);
            } else {
              setScanStatus("error");
              setAlertMessage("このゲストは無効です。");
              setSmDrawerStatus(true);
            }
          })
          .catch((err: AxiosError) => {
            setLoading(false);
            setScanStatus("error");
            setAlertMessage(err.message);
            setSmDrawerStatus(true);
          });
      } else if (scanText.startsWith("R")) {
        setScanStatus("error");
        setAlertMessage("これは予約IDです。");
        setSmDrawerStatus(true);
      } else {
        setScanStatus("error");
        setAlertMessage("このゲストIDは存在しません。");
        setSmDrawerStatus(true);
      }
    }
  };

  const registerSession = () => {
    if (token && profile && guestInfo) {
      apiClient(process.env.REACT_APP_API_BASE_URL)
        .activity.exit.$post({
          body: {
            guest_id: text,
            exhibit_id: "entrance",
          },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setDeviceState(true);
          setText("");
          setAlertMessage("");
          setScanStatus("waiting");
          setSmDrawerStatus(false);
          setSnackbarMessage(`${text}の退場処理が完了しました。`);
        })
        .catch((err: AxiosError) => {
          setSnackbarMessage(`何らかのエラーが発生しました。${err.message}`);
          setText("");
          setDeviceState(true);
          setSmDrawerStatus(false);
        })
        .finally(() => {
          setShowScanGuide(true);
        });
    }
  };

  const retry = () => {
    setScanStatus("waiting");
    setText("");
    setAlertMessage(null);
    setGuestInfo(null);
    setDeviceState(true);
    setShowScanGuide(true);
  };

  const onNumPadClose = (num: number[]) => {
    if (num.length > 0) {
      handleScan("G" + num.map((n) => String(n)).join(""));
      if (profile) {
        ReactGA.event({
          category: "numpad",
          action: "entrance_exit_use_numpad",
          label: profile.user_id,
        });
      }
    }
  };

  const GuestInfoCard = () => {
    return (
      <>
        {alertMessage && (
          <Alert
            severity="error"
            variant="filled"
            action={
              <Button color="inherit" onClick={retry}>
                スキャンし直す
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
                  <AssignmentIndRoundedIcon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <GroupWorkRoundedIcon />
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
                退場
              </Button>
            </Box>
          </Card>
        )}
      </>
    );
  };

  return (
    <>
      <Grid container spacing={2} sx={{ py: 2, justifyContent: "space-evenly" }}>
        <Grid item xs={12}>
          <Grid
            container
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "nowrap",
            }}
          >
            <Grid item>
              <Typography variant="h3">退場処理</Typography>
              <Typography variant="body1">
                会場からの退場処理を行います。
              </Typography>
            </Grid>
            <Grid item>
              <NumPad scanType="guest" onClose={onNumPadClose} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md="auto">
          <Scanner handleScan={handleScan} />
        </Grid>
        <Grid item xs={12} md={5}>
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
            (largerThanSM ? (
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
        <Snackbar
          open={snackbarMessage !== null}
          autoHideDuration={6000}
          onClose={() => setSnackbarMessage(null)}
        >
          <Alert severity="success">{snackbarMessage}</Alert>
        </Snackbar>
      </Grid>
      <ScanGuide show={showScanGuide} />
    </>
  );
};

export default EntranceExit;
