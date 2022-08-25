import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  tokenAtom,
  profileAtom,
  deviceStateAtom,
  reservationAtom,
  setTitle,
} from "#/components/lib/jotai";
import ReactGA from "react-ga4";
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
  Button,
} from "@mui/material";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import GroupWorkRoundedIcon from "@mui/icons-material/GroupWorkRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";

import {
  getTimePart,
  guestIdValidation,
  handleApiError,
} from "#/components/lib/commonFunction";
import useDeviceWidth from "#/components/lib/useDeviceWidth";
import Scanner from "#/components/block/Scanner";
import NumPad from "#/components/block/NumPad";
import MessageDialog from "#/components/block/MessageDialog";

const EntranceEnter: React.VFC = () => {
  setTitle("エントランス入場処理");
  const navigate = useNavigate();
  const { largerThanSM, largerThanMD } = useDeviceWidth();
  const token = useAtomValue(tokenAtom);
  const profile = useAtomValue(profileAtom);
  const [text, setText] = useState<string>("");
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [reservation, setReservation] = useAtom(reservationAtom);
  const [guestList, setGuest] = useState<string[]>([]);
  const [smDrawerOpen, setSmDrawerStatus] = useState<boolean>(false);
  const setDeviceState = useSetAtom(deviceStateAtom);
  const [dialogMessage, setDialogMessage] = useState<string | null>(null);

  useEffect(() => {
    // reserve-checkのフローを経ていない場合はreserve-checkのページに遷移させる
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

  useEffect(() => {
    if (reservation) {
      if (guestList.length < reservation.count) {
        setInfoMessage(
          `${guestList.length + 1}枚目のリストバンドをスキャンしてください`
        );
      } else {
        setInfoMessage(
          `予約されている人数分のリストバンドの読み込みが終わりました。「登録」を押してください`
        );
      }
    }
  }, [guestList]);

  const handleScan = (scanText: string | null) => {
    if (scanText && text !== scanText) {
      if (profile && reservation) {
        setText(scanText);
        setSmDrawerStatus(true);
        if (guestIdValidation(scanText)) {
          if (!guestList.includes(scanText)) {
            if (guestList.length < reservation.count) {
              setGuest([...guestList, scanText]);
            } else {
              setAlertMessage(
                "この予約を使って登録可能なリストバンドの数の上限に達しました。"
              );
            }
          } else {
            setAlertMessage(`${scanText}は登録済みです。`);
          }
        } else {
          setAlertMessage(`${scanText}というゲストは存在しません。`);
        }
      }
    }
  };

  const reset = (target: number) => {
    const newGuestList: string[] = [];
    for (let i = 0; i < guestList.length; i++) {
      if (i !== target) {
        newGuestList.push(guestList[i]);
      }
    }
    setGuest(newGuestList);
    setText("");
  };

  const onNumPadClose = (num: number[]) => {
    if (num.length > 0) {
      handleScan("G" + num.map((n) => String(n)).join(""));
      ReactGA.event({
        category: "numpad",
        action: "entrance_enter_use_numpad",
        label: profile?.user_id,
      });
    }
  };

  const onDialogClose = () => {
    setDialogMessage(null);
    setText("");
    setReservation(null);
    navigate("/entrance/reserve-check", { replace: true });
  };

  const ReservationInfoCard: React.VFC = () => {
    const registerWristband = () => {
      if (token && reservation) {
        setLoading(true);
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
            setDialogMessage(`${guestList.join(",")}の登録が完了しました。`);
          })
          .catch((err: AxiosError) => {
            setAlertMessage(
              "リストバンドの登録に際し何らかのエラーが発生しました。もう一度やり直してください。"
            );
            handleApiError(err, "guest_register_post");
            setText("");
          })
          .finally(() => {
            setLoading(false);
            setDeviceState(true);
            setSmDrawerStatus(false);
          });
      }
    };

    const closeAlert = () => {
      setAlertMessage(null);
    };

    return (
      <>
        {alertMessage && (
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
                非表示
              </Button>
            }
            sx={{ mb: 2 }}
          >
            {alertMessage}
          </Alert>
        )}
        {reservation && (
          <Card variant="outlined" sx={{ p: 2 }}>
            {!largerThanSM && guestList.length < reservation.count && (
              <Alert severity="info" sx={{ mb: 2 }}>
                他のリストバンドも登録する場合は画面上部をタップしてスキャンしてください
              </Alert>
            )}
            <Typography variant="h4">予約情報</Typography>
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
                        <DeleteIcon color="error" />
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
                      variant="contained"
                      onClick={registerWristband}
                      disabled={reservation.registered
                        .filter((guest) => guest.is_spare === 0)
                        .map((guest) => guest.guest_id)
                        .includes(guestList[guestList.length - 1])}
                    >
                      すべて登録
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
                <ListItemText>{reservation.count}人</ListItemText>
              </ListItem>
            </List>
            <Box
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
                startIcon={<ReplayRoundedIcon />}
                onClick={() =>
                  navigate("/entrance/reserve-check", { replace: true })
                }
              >
                最初からやり直す
              </Button>
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
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "nowrap",
            }}
          >
            <Grid item>
              <Typography variant="h3">リストバンド登録</Typography>
              <Typography variant="body1">
                予約情報とリストバンドの紐づけを行います。
              </Typography>
            </Grid>
            <Grid item>
              <NumPad scanType="guest" onClose={onNumPadClose} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid
            container
            spacing={2}
            sx={{ flexDirection: "column", alignItems: "center" }}
          >
            <Grid item xs={12}>
              <Alert severity="info">{infoMessage}</Alert>
            </Grid>
            <Grid item xs={12}>
              <Scanner handleScan={handleScan} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            ゲストID: {text}
          </Typography>
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
              onClose={() => setSmDrawerStatus(false)}
              onOpen={() => setSmDrawerStatus(true)}
            >
              <ReservationInfoCard />
            </SwipeableDrawer>
          )}
        </Grid>
      </Grid>
      <MessageDialog
        open={dialogMessage !== null}
        type="success"
        title="処理が完了しました"
        message={dialogMessage as string}
        onClose={onDialogClose}
      />
    </>
  );
};

export default EntranceEnter;
