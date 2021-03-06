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

import {
  getTimePart,
  guestIdValidation,
} from "#/components/lib/commonFunction";
import Scanner from "#/components/block/Scanner";
import NumPad from "#/components/block/NumPad";
import { guestInfoProp } from "#/types/global";

const EntranceExit = () => {
  const theme = useTheme();
  const largerThanSM = useMediaQuery(theme.breakpoints.up("sm"));
  const token = useRecoilValue(tokenState);
  const profile = useRecoilValue(profileState);
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
    setPageInfo({ title: "??????????????????" });
  }, []);

  const handleScan = (scanText: string | null) => {
    if (token && scanText) {
      setText(scanText);
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
              setMessage("?????????????????????????????????");
              setSmDrawerStatus(true);
            }
          })
          .catch((err: AxiosError) => {
            setLoading(false);
            setScanStatus("error");
            setMessage(err.message);
            setSmDrawerStatus(true);
          });
      } else if (scanText.startsWith("R")) {
        setScanStatus("error");
        setMessage("???????????????ID?????????");
        setSmDrawerStatus(true);
      } else {
        setScanStatus("error");
        setMessage("???????????????ID????????????????????????");
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
          setMessage("");
          setSnackbar({ status: false, message: "", severity: "success" });
          setScanStatus("waiting");
          setSmDrawerStatus(false);
          setSnackbar({
            status: true,
            message: `${text}???????????????????????????????????????`,
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
              message: "?????????????????????????????????????????????",
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

  const onNumPadClose = (num: number[]) => {
    if (num.length > 0) {
      handleScan("G" + num.map((n) => String(n)).join(""));
    }
  };

  const GuestInfoCard = () => {
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
        {scanStatus === "success" && guestInfo && (
          <Card variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h4">???????????????</Typography>
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
                      ? "??????"
                      : guestInfo.guest_type === "family"
                      ? "?????????"
                      : "?????????"
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
              <Button variant="outlined" onClick={retry}>
                ?????????????????????
              </Button>
              <Button variant="contained" onClick={registerSession}>
                ??????
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
                ?????????????????????????????????????????????
              </Typography>
            </Grid>
            <Grid item>
              <NumPad scanType="guest" onClose={onNumPadClose} />
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
              ?????????ID:
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
                      aria-label="?????????ID????????????"
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
    </>
  );
};

export default EntranceExit;
