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
import { AxiosError } from "axios";
import apiClient from '#/axios-config';

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
import { generalFailedProp } from "#/types/global";

const ReserveCheck = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
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
  const [message, setMessage] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [smDrawerOpen, setSmDrawerStatus] = useState(false);

  const setDeviceState = useSetRecoilState(deviceState);
  const setPageInfo = useSetRecoilState(pageStateSelector);

  useEffect(() => {
    setPageInfo({ title: "入場処理" });
  }, []);

  const handleScan = (scanText: string | null) => {
    if (scanText) {
      setText(scanText);
      if (token && scanText.length === 7 && scanText.startsWith("R")) {
        setDeviceState(false);
        setLoading(true);
        apiClient(process.env.REACT_APP_API_BASE_URL).reservation.info._reservation_id(scanText).$get({
          headers: { Authorization: "Bearer " + token },
        })
          .then((res) => {
            setLoading(false);
            setReservation(res);
            if (res.available) {
              if (res.count === res.registered) {
                setScanStatus("error");
                setMessage(["この予約idは既に利用済みです。"]);
                setSmDrawerStatus(true);
              } else {
                setScanStatus("success");
                setSmDrawerStatus(true);
              }
            } else {
              setScanStatus("error");
              setMessage(["この予約idは無効です。"]);
              setSmDrawerStatus(true);
            }
          })
          .catch((err: AxiosError<generalFailedProp>) => {
            setLoading(false);
            setScanStatus("error");
            setMessage([err.message]);
            setSmDrawerStatus(true);
          });
      } else {
        setScanStatus("error");
        setMessage(["予約idの形式が正しくありません。"]);
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

  const ReservationInfoCard = () => {
    return (
      <>
        {scanStatus === "error" && (
          <Alert
            severity="error"
            action={
              <Button color="error" onClick={retry}>
                スキャンし直す
              </Button>
            }
          >
            {message.map((text, index) => (
              <span key={index}>{text}</span>
            ))}
          </Alert>
        )}
        {reservation && scanStatus === "success" && (
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
                  primary={reservation.guest_type}
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
              <ListItem>
                <ListItemIcon>
                  <PeopleRoundedIcon />
                </ListItemIcon>
                <ListItemText primary={`${reservation.count}人`} />
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
              <Button
                variant="contained"
                onClick={() => navigate("/entrance/enter", { replace: true })}
              >
                リストバンドの登録
              </Button>
            </Box>
          </Card>
        )}
      </>
    );
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12}>
        <Typography variant="h3">Step1: 予約用QRコードスキャン</Typography>
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
                        navigator.clipboard.writeText(text);
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
            <ReservationInfoCard />
          ) : (
            <SwipeableDrawer
              anchor="bottom"
              open={smDrawerOpen}
              onClose={() => retry()}
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
  );
};

export default ReserveCheck;
