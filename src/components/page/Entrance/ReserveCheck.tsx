import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
  useResetRecoilState,
} from "recoil";
import { tokenState } from "#/recoil/user";
import { deviceState } from "#/recoil/scan";
import { pageStateSelector } from "#/recoil/page";
import { reservationState } from "#/recoil/reservation";
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
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";

import Scanner from "#/components/block/Scanner";
import {
  getTimePart,
  reservationIdValidation,
} from "#/components/lib/commonFunction";
import NumPad from "#/components/block/NumPad";

const ReserveCheck = () => {
  const theme = useTheme();
  const largerThanSM = useMediaQuery(theme.breakpoints.up("sm"));
  const navigate = useNavigate();
  const token = useRecoilValue(tokenState);
  const [reservation, setReservation] = useRecoilState(reservationState);
  const resetReservation = useResetRecoilState(reservationState);
  const [snackbar, setSnackbar] = useState<{
    status: boolean;
    message: string;
    severity: "success" | "error";
  }>({ status: false, message: "", severity: "success" });
  const [text, setText] = useState("");
  const [scanStatus, setScanStatus] = useState<"waiting" | "success" | "error">(
    "waiting"
  );
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [smDrawerOpen, setSmDrawerStatus] = useState(false);

  const setDeviceState = useSetRecoilState(deviceState);
  const setPageInfo = useSetRecoilState(pageStateSelector);

  useEffect(() => {
    setPageInfo({ title: "??????????????????????????????" });
  }, []);

  const handleScan = (scanText: string | null) => {
    if (scanText && token) {
      setText(scanText);
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
                setMessage("????????????ID??????????????????????????????");
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
              setMessage("????????????ID??????????????????");
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
        setMessage("??????????????????ID???????????????ID????????????????????????????????????");
        setSmDrawerStatus(true);
        ReactGA.event({
          category: "scan",
          action: "entrance_is_guest_id",
          label: scanText,
        });
      } else {
        setScanStatus("error");
        setMessage("???????????????ID????????????????????????");
        setSmDrawerStatus(true);
      }
    }
  };

  const retry = () => {
    setScanStatus("waiting");
    setText("");
    resetReservation();
    setDeviceState(true);
  };

  const onNumPadClose = (num: number[]) => {
    if (num.length > 0) {
      handleScan("R" + num.map((n) => String(n)).join(""));
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
                ?????????????????????
              </Button>
            }
          >
            {message}
          </Alert>
        )}
        {reservation && scanStatus === "success" && (
          <Card variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h4">????????????</Typography>
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
                    reservation.guest_type === "family" ? "?????????" : "?????????"
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
                  {reservation.count}???
                  {reservation.count !== reservation.registered.length && (
                    <span>
                      ????????????
                      {reservation.count - reservation.registered.length}??????
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
              <Button variant="outlined" onClick={retry}>
                ?????????????????????
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/entrance/enter", { replace: true })}
              >
                ???????????????????????????
              </Button>
            </Box>
          </Card>
        )}
      </>
    );
  };

  return (
    <>
      <Grid container spacing={2} sx={{ p: 2 }}>
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
              <Typography variant="h3">????????????</Typography>
              <Typography variant="body1">
                ?????????QR?????????????????????????????????????????????
              </Typography>
            </Grid>
            <Grid item>
              <NumPad scanType="reservation" onClose={onNumPadClose} />
            </Grid>
          </Grid>
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
            <Typography variant="h4" sx={{ whiteSpace: "noWrap" }}>
              ??????ID:
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
                      aria-label="??????ID????????????"
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

export default ReserveCheck;
