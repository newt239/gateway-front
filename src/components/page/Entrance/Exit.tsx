import React, { useEffect, useState } from "react";
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
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import GroupWorkRoundedIcon from "@mui/icons-material/GroupWorkRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";

import generalProps from "#/components/functional/generalProps";
import Scanner from "#/components/block/Scanner";
import { guestInfoProp } from "#/types/global";

const EntranceExit = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const token = useRecoilValue(tokenState);
  const profile = useRecoilValue(profileState);
  const [text, setText] = useState<string>("");
  const [scanStatus, setScanStatus] = useState<"waiting" | "success" | "error">(
    "waiting"
  );
  const [message, setMessage] = useState<string[]>([]);
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
    setPageInfo({ title: "エントランス" });
  }, []);

  const handleScan = (scanText: string | null) => {
    if (token && scanText) {
      setText(scanText);
      if (scanText.length === 10 && scanText.startsWith("G")) {
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
              setScanStatus("error");
              setMessage(["このゲストは無効です。"]);
              setSmDrawerStatus(true);
            } else {
              setScanStatus("success");
              setSmDrawerStatus(true);
            }
          })
          .catch((err: AxiosError) => {
            setLoading(false);
            setScanStatus("error");
            setMessage([err.message]);
            setSmDrawerStatus(true);
          });
      } else {
        setScanStatus("error");
        setMessage(["ゲストidの形式が正しくありません。"]);
        setSmDrawerStatus(true);
      }
    }
  };

  const postApi = () => {
    if (token && profile && guestInfo) {
      // TODO: エンドポイントを別個に用意するか検討
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
          setMessage([]);
          setSnackbar({ status: false, message: "", severity: "success" });
          setScanStatus("waiting");
          setSmDrawerStatus(false);
          setSnackbar({
            status: true,
            message: `${text}の退場処理に成功しました。`,
            severity: "success",
          });
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

  const retry = () => {
    setScanStatus("waiting");
    setText("");
    setGuestInfo(null);
    setDeviceState(true);
  };

  const GuestInfoCard = () => {
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
                    // TODO: string template literalへの対応
                    generalProps.reservation.guest_type["student"]
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
                退場
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
        <Card variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h3">退場処理</Typography>
          <Typography variant="body1">会場からの退場処理を行います</Typography>
        </Card>
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
              onClose={() => retry()}
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
  );
};

export default EntranceExit;
