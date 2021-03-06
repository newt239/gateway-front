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
  SwipeableDrawer,
  Grid,
  Typography,
  IconButton,
  Box,
  LinearProgress,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Divider,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Button,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import GroupWorkRoundedIcon from "@mui/icons-material/GroupWorkRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";

import {
  getTimePart,
  guestIdValidation,
} from "#/components/lib/commonFunction";
import Scanner from "#/components/block/Scanner";
import NumPad from "#/components/block/NumPad";
import MessageDialog from "#/components/block/MessageDialog";

const EntranceEnter = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const largerThanSM = useMediaQuery(theme.breakpoints.up("sm"));
  const token = useRecoilValue(tokenState);
  const profile = useRecoilValue(profileState);
  const [text, setText] = useState<string>("");
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const reservation = useRecoilValue(reservationState);
  const resetReservation = useResetRecoilState(reservationState);
  const [guestList, setGuest] = useState<string[]>([]);
  const [smDrawerOpen, setSmDrawerStatus] = useState(false);

  const [infoMessage, setInfoMessage] = useState("");

  const setDeviceState = useSetRecoilState(deviceState);
  const setPageInfo = useSetRecoilState(pageStateSelector);

  useEffect(() => {
    setPageInfo({ title: "??????????????????????????????" });
  }, []);

  useEffect(() => {
    // reserve-check???????????????????????????????????????reserve-check??????????????????????????????
    if (!reservation || reservation.reservation_id === "") {
      navigate("/entrance/reserve-check", { replace: true });
    }
    if (reservation) {
      setGuest(
        reservation.registered
          .filter((guest) => guest.is_spare === 0)
          .map((guest) => guest.guest_id)
      );
    }
  }, [reservation]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  useEffect(() => {
    if (reservation) {
      if (guestList.length < reservation.count) {
        setInfoMessage(
          `${guestList.length + 1}??????????????????????????????????????????????????????`
        );
      } else {
        setInfoMessage(
          `??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????`
        );
      }
    }
  }, [guestList]);

  const handleScan = (scanText: string | null) => {
    if (text !== scanText) {
      if (profile && reservation && scanText) {
        setText(scanText);
        if (guestIdValidation(scanText)) {
          if (!guestList.includes(scanText)) {
            setSmDrawerStatus(true);
            setGuest([...guestList, scanText]);
          } else {
            setAlertMessage(`${scanText}????????????????????????`);
            setAlertStatus(true);
          }
        } else {
          setAlertMessage(`${scanText}??????????????????????????????????????????`);
          setAlertStatus(true);
        }
      }
    }
  };

  const registerWristband = () => {
    setLoading(true);
    if (token && reservation) {
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
          setSmDrawerStatus(false);
          setDialogOpen(true);
          setDialogMessage(`${guestList.join(",")}?????????????????????????????????`);
        })
        .catch((err: AxiosError) => {
          console.log(err.message);
          setText("");
          setDeviceState(true);
          setSmDrawerStatus(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const reset = (target: number) => {
    setGuest(guestList.splice(target - 1, 1));
  };

  const closeAlert = () => {
    setAlertMessage("");
    setAlertStatus(false);
  };

  const onNumPadClose = (num: number[]) => {
    if (num.length > 0) {
      handleScan("G" + num.map((n) => String(n)).join(""));
    }
  };

  const onDialogClose = () => {
    setDialogOpen(false);
    setDialogMessage("");
    navigate("/entrance/reserve-check", { replace: true });
  };

  const ReservationInfoCard = () => {
    return (
      <>
        {alertStatus && (
          <Alert
            variant="filled"
            severity="error"
            action={
              <Button
                color="inherit"
                sx={{
                  whiteSpace: "nowrap",
                }}
                onClick={closeAlert}
              >
                ?????????
              </Button>
            }
          >
            {alertMessage}
          </Alert>
        )}
        {reservation && (
          <Card variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h4">????????????</Typography>
            <List dense>
              {guestList.map((guest, index) => (
                <ListItem
                  key={guest}
                  secondaryAction={
                    !reservation.registered
                      .filter((guest) => guest.is_spare === 0)
                      .map((guest) => guest.guest_id)
                      .includes(guest) && (
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => reset(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )
                  }
                >
                  <ListItemIcon>
                    <PersonRoundedIcon />
                  </ListItemIcon>
                  <ListItemText>{guest}</ListItemText>
                </ListItem>
              ))}
              {guestList.length !== 0 && (
                <>
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
                      onClick={() =>
                        navigate("/entrance/reserve-check", { replace: true })
                      }
                    >
                      ????????????
                    </Button>
                    <Button
                      variant="contained"
                      onClick={registerWristband}
                      disabled={reservation.registered
                        .filter((guest) => guest.is_spare === 0)
                        .map((guest) => guest.guest_id)
                        .includes(guestList[guestList.length - 1])}
                    >
                      ??????
                    </Button>
                  </Box>
                  <Divider />
                </>
              )}
              <ListItem>
                <ListItemIcon>
                  <AssignmentIndRoundedIcon />
                </ListItemIcon>
                <ListItemText>{reservation.reservation_id}</ListItemText>
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
                <ListItemText>{reservation.count}???</ListItemText>
              </ListItem>
            </List>
          </Card>
        )}
      </>
    );
  };

  return (
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
            <Typography variant="h3">????????????????????????</Typography>
            <Typography variant="body1">
              ?????????????????????????????????QR?????????????????????????????????????????????
            </Typography>
          </Grid>
          <Grid item>
            <NumPad scanType="guest" onClose={onNumPadClose} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Alert severity="info">{infoMessage}</Alert>
          </Grid>
          <Grid item xs={12}>
            <Scanner handleScan={handleScan} />
          </Grid>
        </Grid>
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
        {largerThanSM ? (
          <ReservationInfoCard />
        ) : (
          <SwipeableDrawer
            anchor="bottom"
            open={smDrawerOpen}
            onClose={() => reset(0)}
            onOpen={() => setSmDrawerStatus(true)}
          >
            <ReservationInfoCard />
          </SwipeableDrawer>
        )}
      </Grid>
      <MessageDialog
        open={dialogOpen}
        type="success"
        title="???????????????????????????"
        message={[dialogMessage]}
        onClose={onDialogClose}
      />
    </Grid>
  );
};

export default EntranceEnter;
