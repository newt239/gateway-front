import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState, useResetRecoilState } from "recoil";
import { tokenState, profileState } from "#/recoil/user";
import { deviceState } from "#/recoil/scan";
import { pageStateSelector } from "#/recoil/page";
import { reservationState } from "#/recoil/reservation";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";

import {
  MobileStepper,
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
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import GroupWorkRoundedIcon from "@mui/icons-material/GroupWorkRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

import generalProps from "#/components/functional/generalProps";
import Scanner from "#/components/block/Scanner";
import { generalFailedProp } from "#/types/global";

const EntranceEnter = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const token = useRecoilValue(tokenState);
  const profile = useRecoilValue(profileState);
  const [text, setText] = useState<string>("");
  const [scanStatus, setScanStatus] = useState<"waiting" | "success" | "error">(
    "waiting"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const reservation = useRecoilValue(reservationState);
  const resetReservation = useResetRecoilState(reservationState);
  const [guestList, setGuest] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState<{
    status: boolean;
    message: string;
    severity: "success" | "error";
  }>({ status: false, message: "", severity: "success" });
  const [smDrawerOpen, setSmDrawerStatus] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const setDeviceState = useSetRecoilState(deviceState);
  const setPageInfo = useSetRecoilState(pageStateSelector);

  useEffect(() => {
    setPageInfo({ title: "入場処理" });
  }, []);

  useEffect(() => {
    // reserve-checkのフローを経ていない場合はreserve-checkのページに遷移させる
    if (!reservation || reservation.reservation_id === "") {
      navigate("/entrance/reserve-check", { replace: true });
    }
  }, [reservation]);

  const handleScan = (scanText: string | null) => {
    if (reservation && scanText && profile) {
      setText(scanText);
      if (scanText.length === 10 && scanText.startsWith("G")) {
        if (!guestList.some((guest) => guest === scanText)) {
          setGuest([...guestList, scanText]);
          setScanStatus("success");
          setActiveStep(guestList.length);
        }
      }
    }
  };
  const postApi = () => {
    setLoading(true);
    if (token && reservation && guestList.length === reservation.count) {
      apiClient(process.env.REACT_APP_API_BASE_URL)
        .guest.register.$post({
          body: {
            reservation_id: reservation.reservation_id,
            guest_type: reservation.guest_type,
            guest_id: guestList,
            part: reservation.part,
          },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          resetReservation();
          setDeviceState(true);
          setText("");
          setSnackbar({ status: false, message: "", severity: "success" });
          setScanStatus("waiting");
          setSmDrawerStatus(false);
          navigate("/entrance/reserve-check", { replace: true });
        })
        .catch((err: AxiosError<generalFailedProp>) => {
          if (err.message) {
            setSnackbar({
              status: true,
              message: err.message,
              severity: "error",
            });
          } else {
            setSnackbar({
              status: true,
              message: "何らかのエラーが発生しました。",
              severity: "error",
            });
          }
          setText("");
          setDeviceState(true);
          setSmDrawerStatus(false);
        });
      setLoading(false);
    }
  };

  const GuestInfoCard = () => {
    return (
      <>
        {reservation && guestList.length !== 0 && (
          <>
            <MobileStepper
              variant="dots"
              steps={reservation.count - reservation.registered}
              position="static"
              activeStep={activeStep}
              sx={{ flexGrow: 1 }}
              nextButton={
                <Button
                  size="small"
                  onClick={() =>
                    setActiveStep((prevActiveStep) => prevActiveStep + 1)
                  }
                  disabled={activeStep === guestList.length - 1}
                >
                  Next
                  {theme.direction === "rtl" ? (
                    <KeyboardArrowLeft />
                  ) : (
                    <KeyboardArrowRight />
                  )}
                </Button>
              }
              backButton={
                <Button
                  size="small"
                  onClick={() =>
                    setActiveStep((prevActiveStep) => prevActiveStep - 1)
                  }
                  disabled={activeStep === 0}
                >
                  {theme.direction === "rtl" ? (
                    <KeyboardArrowRight />
                  ) : (
                    <KeyboardArrowLeft />
                  )}
                  Back
                </Button>
              }
            />
            <Card variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h4">
                ゲスト情報 ( {activeStep + 1} /{" "}
                {reservation.count - reservation.registered} )
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <AssignmentIndRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary={guestList[activeStep]} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <GroupWorkRoundedIcon />
                  </ListItemIcon>
                  <ListItemText
                    // TODO: string template literalへの対応
                    primary={generalProps.reservation.guest_type["student"]}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeRoundedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      reservation.part === "all" ? "全時間帯" : reservation.part
                    }
                  />
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
                <Button variant="outlined" onClick={() => retry(activeStep)}>
                  スキャンし直す
                </Button>
              </Box>
            </Card>
            <Box
              m={1}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                gap: "1rem",
              }}
            >
              <Button variant="outlined" onClick={() => retry(0)}>
                全てスキャンし直す
              </Button>
              <Button variant="contained" onClick={postApi}>
                登録
              </Button>
            </Box>
          </>
        )}
      </>
    );
  };

  const retry = (activeStep: number) => {
    setDeviceState(true);
    setText("");
    setSnackbar({ status: false, message: "", severity: "success" });
    setScanStatus("waiting");
    setSmDrawerStatus(false);
    if (activeStep === 0) {
      setGuest([]);
    } else {
      const newGuestList = guestList;
      setGuest(newGuestList.splice(activeStep - 1, 1));
    }
  };

  return (
    <>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12}>
          <Typography variant="h3">
            Step2: 登録するリストバンドのQRコードをかざしてください
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
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
            <Typography variant="h4">id:</Typography>
            <FormControl sx={{ m: 1, flexGrow: 1 }} variant="outlined">
              <OutlinedInput
                type="text"
                size="small"
                value={text}
                onChange={(e) => setText(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="copy id to clipboard"
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
                onClose={() => retry(0)}
                onOpen={() => setSmDrawerStatus(true)}
              >
                <GuestInfoCard />
              </SwipeableDrawer>
            ))}
        </Grid>
        <Snackbar
          open={snackbar.status}
          autoHideDuration={6000}
          onClose={() =>
            setSnackbar({ status: false, message: "", severity: "success" })
          }
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Grid>
    </>
  );
};

export default EntranceEnter;
