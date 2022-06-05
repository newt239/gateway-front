import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { tokenState, profileState } from "#/recoil/user";
import { deviceState } from "#/recoil/scan";
import { pageStateSelector } from "#/recoil/page";
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
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";

import Scanner from "#/components/block/Scanner";
import { guestInfoProp } from "#/types/global";

type ExhibitScanProps = {
  scanType: "enter" | "exit";
};

const ExhibitScan = ({ scanType }: ExhibitScanProps) => {
  const { exhibit_id } = useParams<{ exhibit_id: string }>() || "unknown";

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
  const [snackbar, setSnackbar] = useState<{
    status: boolean;
    message: string;
    severity: "success" | "error";
  }>({ status: false, message: "", severity: "success" });
  const [smDrawerOpen, setSmDrawerStatus] = useState(false);

  const setDeviceState = useSetRecoilState(deviceState);
  const setPageInfo = useSetRecoilState(pageStateSelector);

  useEffect(() => {
    setScanStatus("waiting");
    setMessage("");
    setPageInfo({
      title: scanType === "enter" ? "入室スキャン" : "退室スキャン",
    });
  }, [scanType]);

  const handleScan = (scanText: string | null) => {
    if (scanText) {
      if (scanText.length === 10 && scanText.startsWith("G") && token) {
        setDeviceState(false);
        setText(scanText);
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
                  } else {
                    setScanStatus("error");
                    setMessage("このゲストはすでに他の展示に入室中です。");
                  }
                } else if (scanType === "exit") {
                  if (res.exhibit_id === exhibit_id) {
                    setScanStatus("success");
                  } else if (res.exhibit_id === "") {
                    setScanStatus("error");
                    setMessage(
                      "このゲストは現在この展示に入室していません。入室スキャンと間違えていませんか？"
                    );
                  } else {
                    setScanStatus("error");
                    setMessage("このゲストは他の展示に入室中です。");
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
          });
        setLoading(false);
      } else {
        setScanStatus("error");
        setMessage("ゲストidの形式が正しくありません。");
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
    setSmDrawerStatus(false);
  };

  const GuestInfoCard = () => {
    const postApi = () => {
      if (profile && guestInfo && token && exhibit_id) {
        const payload = {
          guest_id: text,
          guest_type: guestInfo.guest_type,
          exhibit_id: exhibit_id,
          user_id: profile.user_id,
        };
        apiClient(process.env.REACT_APP_API_BASE_URL)
          .activity[scanType].$post({
            headers: { Authorization: "Bearer " + token },
            body: payload,
          })
          .then(() => {
            setDeviceState(true);
            setText("");
            setMessage("");
            setSnackbar({
              status: true,
              message: "処理が完了しました。",
              severity: "success",
            });
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
      }
    };

    return (
      <>
        {scanStatus === "error" && (
          <Alert
            severity="error"
            action={
              <Button variant="text" color="error" onClick={retry}>
                スキャンし直す
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
                      : guestInfo.guest_type
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AccessTimeRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    guestInfo.part === "all" ? "全時間帯" : guestInfo.part
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
              <Button variant="outlined" onClick={retry}>
                スキャンし直す
              </Button>
              <Button variant="contained" onClick={postApi}>
                登録
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
        {exhibit_id}
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

export default ExhibitScan;
