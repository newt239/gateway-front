import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
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
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  CircularProgress,
  Link,
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

const EntranceOtherEnter: React.VFC = () => {
  setTitle("エントランス入場処理");
  const { largerThanSM, largerThanMD } = useDeviceWidth();
  const token = useAtomValue(tokenAtom);
  const profile = useAtomValue(profileAtom);
  const [text, setText] = useState<string>("");
  const [scanStatus, setScanStatus] = useState<"waiting" | "success" | "error">(
    "waiting"
  );
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);
  const [guestInfo, setGuestInfo] = useState<GuestInfoProps | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [smDrawerOpen, setSMDrawerOpen] = useState<boolean>(false);
  const [showScanGuide, setShowScanGuide] = useState<boolean>(true);
  const setDeviceState = useSetAtom(deviceStateAtom);

  const handleScan = (scanText: string | null) => {
    if (scanText && scanText !== text && token) {
      setAlertMessage(null);
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
            if (res.guest_type === "family") {
              setScanStatus("error");
              if (res.reservation_id === "family") {
                setAlertMessage(
                  "このリストバンドは未使用ですが、保護者用のものです。"
                );
              } else {
                setAlertMessage(
                  "このリストバンドは保護者用のもので、すでに使用されています。"
                );
              }
            } else if (res.available) {
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
      } else if (scanText.endsWith("=")) {
        setScanStatus("error");
        setAlertMessage(
          "これは予約用QRコードです。リストバンドのQRコードをスキャンしてください。"
        );
      } else {
        setScanStatus("error");
        setAlertMessage("このゲストIDは存在しません。");
      }
      setSMDrawerOpen(true);
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
        action: "entrance_other_enter_use_numpad",
        label: profile?.user_id,
      });
    }
  };

  const GuestInfoCard = () => {
    const registerSession = () => {
      if (token && profile && guestInfo) {
        setRegisterLoading(true);
        apiClient(process.env.REACT_APP_API_BASE_URL)
          .activity.enter.$post({
            body: {
              guest_id: text,
              exhibit_id: "entrance",
            },
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            setAlertMessage(null);
            setScanStatus("waiting");
            setSnackbarMessage(`${text}の入場処理が完了しました。`);
          })
          .catch((err: AxiosError) => {
            handleApiError(err, "activity_other_enter_post");
            setSnackbarMessage(`何らかのエラーが発生しました。${err.message}`);
          })
          .finally(() => {
            setText("");
            setDeviceState(true);
            setShowScanGuide(true);
            setSMDrawerOpen(false);
            setRegisterLoading(false);
          });
      }
    };

    return (
      <>
        {alertMessage && (
          <Alert
            severity="error"
            variant="filled"
            onClose={reset}
            sx={{ my: 1, mx: !largerThanMD ? 1 : 0 }}
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
                  入場記録
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
      <Grid container spacing={2} sx={{ justifyContent: "space-evenly" }}>
        <Grid item xs={12} sx={{ mb: largerThanMD ? 3 : 0 }}>
          <Grid
            container
            spacing={2}
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "nowrap",
            }}
          >
            <Grid item>
              <Typography variant="h3">保護者以外の入場</Typography>
              <Typography variant="body1">
                リストバンドをかざしてください。保護者の入場は{" "}
                <Link component={RouterLink} to="/entrance/reserve-check">
                  予約確認
                </Link>{" "}
                からスキャンしてください。
              </Typography>
            </Grid>
            <Grid item>
              <NumPad scanType="guest" onClose={onNumPadClose} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Alert severity="warning">
            生徒の再入場及びその他特別なゲスト用の処理です。生徒の再入場の場合は本人が持っているリストバンドを使ってください。
          </Alert>
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
            (largerThanSM ? (
              <GuestInfoCard />
            ) : (
              <SwipeableDrawer
                anchor="bottom"
                open={smDrawerOpen}
                onClose={reset}
                onOpen={() => setSMDrawerOpen(true)}
                sx={{ transform: "translateZ(3px)" }}
              >
                <GuestInfoCard />
              </SwipeableDrawer>
            ))}
        </Grid>
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
      </Grid>
      <ScanGuide show={showScanGuide} />
    </>
  );
};

export default EntranceOtherEnter;
