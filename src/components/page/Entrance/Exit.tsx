import React, { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  tokenAtom,
  profileAtom,
  deviceStateAtom,
  setTitle,
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
  Box,
  LinearProgress,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
} from "@mui/material";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import GroupWorkRoundedIcon from "@mui/icons-material/GroupWorkRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";

import { GuestInfoProps } from "#/components/lib/types";
import {
  getTimePart,
  guestIdValidation,
  handleApiError,
} from "#/components/lib/commonFunction";
import useDeviceWidth from "#/components/lib/useDeviceWidth";
import Scanner from "#/components/block/Scanner";
import NumPad from "#/components/block/NumPad";
import ScanGuide from "#/components/block/ScanGuide";

const EntranceExit: React.VFC = () => {
  setTitle("エントランス");
  const token = useAtomValue(tokenAtom);
  const profile = useAtomValue(profileAtom);
  const [text, setText] = useState<string>("");
  const [scanStatus, setScanStatus] = useState<"waiting" | "success" | "error">(
    "waiting"
  );
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [guestInfo, setGuestInfo] = useState<GuestInfoProps | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [smDrawerOpen, setSmDrawerStatus] = useState<boolean>(false);
  const [showScanGuide, setShowScanGuide] = useState<boolean>(true);

  const setDeviceState = useSetAtom(deviceStateAtom);

  const { largerThanSM, largerThanMD } = useDeviceWidth();

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
            } else {
              setScanStatus("error");
              setAlertMessage("このゲストは無効です。");
            }
          })
          .catch((err: AxiosError) => {
            handleApiError(err, "guest_info_get");
            setLoading(false);
            setScanStatus("error");
            setAlertMessage("予期せぬエラーが発生しました。" + err.message);
          });
      } else if (scanText.startsWith("R")) {
        setScanStatus("error");
        setAlertMessage("これは予約IDです。");
      } else {
        setScanStatus("error");
        setAlertMessage("このゲストIDは存在しません。");
      }
      setSmDrawerStatus(true);
    }
  };

  const reset = () => {
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
      ReactGA.event({
        category: "numpad",
        action: "entrance_exit_use_numpad",
        label: profile?.user_id,
      });
    }
  };

  const GuestInfoCard = () => {
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
            setAlertMessage(null);
            setScanStatus("waiting");
            setSnackbarMessage(`${text}の退場処理が完了しました。`);
          })
          .catch((err: AxiosError) => {
            handleApiError(err, "activity_exit_post");
            setSnackbarMessage(`何らかのエラーが発生しました。${err.message}`);
          })
          .finally(() => {
            setText("");
            setDeviceState(true);
            setShowScanGuide(true);
            setSmDrawerStatus(false);
          });
      }
    };

    return (
      <>
        {alertMessage && (
          <Alert
            severity="error"
            variant="filled"
            action={
              <Button color="inherit" onClick={reset}>
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
                onClick={reset}
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
      <Grid container spacing={2} sx={{ justifyContent: "space-evenly" }}>
        <Grid item xs={12} sx={{ mb: largerThanMD ? 3 : 0 }}>
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
                会場からの退場処理を行います。リストバンドをかざしてください。
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
        <Grid item xs={12} md={6}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            ゲストID: {text}
          </Typography>
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
                onClose={reset}
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
