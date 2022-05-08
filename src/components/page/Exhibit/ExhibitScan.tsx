import React, { useState, useEffect, Suspense } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { tokenState, profileState } from "#/recoil/user";
import { deviceState } from "#/recoil/scan";
import { pageStateSelector } from "#/recoil/page";
import { currentExhibitState } from "#/recoil/exhibit";
import axios, { AxiosError, AxiosResponse } from "axios";

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
  AlertTitle,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";

import Scanner from "#/components/block/Scanner";
import { guestInfoProp, guestsInfoSuccessProp } from "#/types/guests";
import { generalFailedProp } from "#/types/global";

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

type ExhibitScanProps = {
  scanType: string;
};

const ExhibitScan = ({ scanType }: ExhibitScanProps) => {
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
    let pageTitle = "展示処理";
    if (scanType === "enter") {
      pageTitle = "入室スキャン";
    } else if (scanType === "exit") {
      pageTitle = "退室スキャン";
    } else if (scanType === "pass") {
      pageTitle = "通過スキャン";
    }
    setPageInfo({ title: pageTitle });
  }, [scanType]);

  const handleScan = (scanText: string | null) => {
    if (scanText) {
      if (scanText.length === 10 && scanText.startsWith("G") && token) {
        setDeviceState(false);
        setText(scanText);
        setLoading(true);
        axios
          .get(`${API_BASE_URL}/v1/guests/info/${scanText}`, {
            headers: { Authorization: "Bearer " + token },
          })
          .then((res: AxiosResponse<guestsInfoSuccessProp>) => {
            setGuestInfo(res.data.data);
            const guestData = res.data.data;
            if (guestData.available) {
              setScanStatus("error");
              setMessage("このゲストは無効です。");
            } else if (
              guestData.revoke_at !== null ||
              guestData.revoke_at === ""
            ) {
              setScanStatus("error");
              setMessage("このゲストは既に退場処理が行われています。");
            } else if (
              scanType === "enter" &&
              guestData.exhibit_id &&
              guestData.exhibit_id !== ""
            ) {
              setScanStatus("error");
              setMessage(
                `このゲストはすでに${guestData.exhibit_id}に入室しています。退室処理と間違えていませんか？`
              );
            } else if (
              scanType === "exit" &&
              (guestData.exhibit_id || guestData.exhibit_id === "")
            ) {
              setScanStatus("error");
              setMessage(
                "このゲストはどこの展示にも入室中ではありません。入室処理と間違えていませんか？"
              );
            } else {
              setScanStatus("success");
            }
            setSmDrawerStatus(true);
          })
          .catch((err: AxiosError<generalFailedProp>) => {
            setScanStatus("error");
            setMessage(err.message);
            setSmDrawerStatus(true);
          });
        setLoading(false);
      } else {
        setScanStatus("error");
        setMessage("ゲストidの形式が正しくありません。");
        setSmDrawerStatus(true);
      }
    }
  };

  const ExhibitName = () => {
    const currentExhibit = useRecoilValue(currentExhibitState);

    return <Typography variant="h3">{currentExhibit.exhibit_name}</Typography>;
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
    const currentExhibit = useRecoilValue(currentExhibitState);

    const postApi = () => {
      if (profile && guestInfo && token) {
        const payload = {
          guest_id: text,
          guest_type: guestInfo.guest_type,
          exhibit_id: currentExhibit.exhibit_id,
          userId: profile.userId,
        };
        axios
          .post(`${API_BASE_URL}/v1/activity/${scanType}`, payload, {
            headers: { Authorization: "Bearer " + token },
          })
          .then((res) => {
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
        <Suspense fallback={<p>読込中...</p>}>
          <ExhibitName />
        </Suspense>
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
