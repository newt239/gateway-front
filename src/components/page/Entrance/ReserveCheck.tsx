import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  tokenAtom,
  profileAtom,
  pageTitleAtom,
  deviceStateAtom,
  reservationAtom,
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
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import GroupWorkRoundedIcon from "@mui/icons-material/GroupWorkRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";

import {
  getTimePart,
  reservationIdValidation,
} from "#/components/lib/commonFunction";
import Scanner from "#/components/block/Scanner";
import NumPad from "#/components/block/NumPad";
import ScanGuide from "#/components/block/ScanGuide";

const ReserveCheck = () => {
  const theme = useTheme();
  const largerThanSM = useMediaQuery(theme.breakpoints.up("sm"));
  const largerThanMD = useMediaQuery(theme.breakpoints.up("md"));
  const navigate = useNavigate();
  const token = useAtomValue(tokenAtom);
  const profile = useAtomValue(profileAtom);
  const [reservation, setReservation] = useAtom(reservationAtom);
  const [text, setText] = useState("");
  const [scanStatus, setScanStatus] = useState<"waiting" | "success" | "error">(
    "waiting"
  );
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [smDrawerOpen, setSmDrawerStatus] = useState(false);
  const [showScanGuide, setShowScanGuide] = useState(true);

  const setDeviceState = useSetAtom(deviceStateAtom);

  const setPageTitle = useSetAtom(pageTitleAtom);
  useEffect(() => {
    setPageTitle("エントランス入場処理");
  }, []);

  const handleScan = (scanText: string | null) => {
    if (scanText && token) {
      setText(scanText);
      setShowScanGuide(false);
      if (reservationIdValidation(scanText)) {
        setDeviceState(false);
        setLoading(true);
        apiClient(process.env.REACT_APP_API_BASE_URL)
          .reservation.info._reservation_id(scanText)
          .$get({
            headers: { Authorization: "Bearer " + token },
          })
          .then((res) => {
            setLoading(false);
            setReservation(res);
            if (res.available) {
              if (res.count === res.registered.length) {
                setScanStatus("error");
                setMessage("この予約IDは既に利用済みです。");
                setSmDrawerStatus(true);
                ReactGA.event({
                  category: "scan",
                  action: "entrance_reservation_used",
                  label: res.reservation_id,
                });
              } else {
                setScanStatus("success");
                setSmDrawerStatus(true);
                ReactGA.event({
                  category: "scan",
                  action: "entrance_reservation_pass",
                  label: res.reservation_id,
                });
              }
            } else {
              setScanStatus("error");
              setMessage("この予約IDは無効です。");
              setSmDrawerStatus(true);
            }
          })
          .catch((err: AxiosError) => {
            setLoading(false);
            setScanStatus("error");
            setMessage(err.message);
            setSmDrawerStatus(true);
          });
      } else if (scanText.startsWith("G")) {
        setScanStatus("error");
        setMessage("これはゲストIDです。予約IDをスキャンしてください。");
        setSmDrawerStatus(true);
        ReactGA.event({
          category: "scan",
          action: "entrance_is_guest_id",
          label: scanText,
        });
      } else {
        setScanStatus("error");
        setMessage("これは予約IDではありません。");
        setSmDrawerStatus(true);
      }
    }
  };

  const retry = () => {
    setScanStatus("waiting");
    setText("");
    setReservation(null);
    setDeviceState(true);
    setShowScanGuide(true);
  };

  const onNumPadClose = (num: number[]) => {
    if (num.length > 0) {
      handleScan("R" + num.map((n) => String(n)).join(""));
      if (profile) {
        ReactGA.event({
          category: "numpad",
          action: "entrance_reserve_use_numpad",
          label: profile.user_id,
        });
      }
    }
  };

  const ReservationInfoCard = () => {
    return (
      <>
        {scanStatus === "error" && (
          <Alert
            severity="error"
            variant="filled"
            action={
              <Button color="inherit" onClick={retry}>
                スキャンし直す
              </Button>
            }
          >
            {message}
          </Alert>
        )}
        {reservation && scanStatus === "success" && (
          <Card variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h4">予約情報</Typography>
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
                    reservation.guest_type === "family" ? "保護者" : "その他"
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AccessTimeRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={getTimePart(reservation.part).part_name}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PeopleRoundedIcon />
                </ListItemIcon>
                <ListItemText>
                  {reservation.count}人
                  {reservation.count !== reservation.registered.length && (
                    <span>
                      （残り：
                      {reservation.count - reservation.registered.length}人）
                    </span>
                  )}
                </ListItemText>
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
              <Button
                variant="contained"
                onClick={() => navigate("/entrance/enter", { replace: true })}
              >
                登録開始
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
        <Grid item xs={12} sx={{ mb: largerThanMD ? 5 : 0 }}>
          <Grid
            container
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "nowrap",
            }}
          >
            <Grid item>
              <Typography variant="h3">予約確認</Typography>
              <Typography variant="body1">
                予約用QRコードをスキャンしてください。
              </Typography>
            </Grid>
            <Grid item>
              <NumPad scanType="reservation" onClose={onNumPadClose} />
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
              予約ID:
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
              <ReservationInfoCard />
            ) : (
              <SwipeableDrawer
                anchor="bottom"
                open={smDrawerOpen}
                onClose={retry}
                onOpen={() => setSmDrawerStatus(true)}
              >
                <ReservationInfoCard />
              </SwipeableDrawer>
            ))}
        </Grid>
      </Grid>
      <ScanGuide show={showScanGuide} />
    </>
  );
};

export default ReserveCheck;
