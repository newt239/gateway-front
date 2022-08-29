import React, { useState } from "react";
import { useAtomValue } from "jotai";
import { tokenAtom, setTitle } from "#/components/lib/jotai";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";

import {
  Grid,
  TextField,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from "@mui/material";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import GroupWorkRoundedIcon from "@mui/icons-material/GroupWorkRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

import { ReservationInfoProps } from "#/components/lib/types";
import {
  getTimePart,
  guestIdValidation,
  reservationIdValidation,
  handleApiError,
} from "#/components/lib/commonFunction";
import MessageDialog from "#/components/block/MessageDialog";

const LostWristband: React.VFC = () => {
  setTitle("リストバンド紛失対応");
  const token = useAtomValue(tokenAtom);
  const [reservationId, setReservationId] = useState<string>("");
  const [reservation, setReservation] = useState<ReservationInfoProps | null>(
    null
  );
  const [newGuestId, setNewGuestId] = useState<string>("");
  const [oldGuestId, setOldGuestId] = useState<string>("not-set");
  const [loading, setLoading] = useState<boolean>(false);
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string | null>(null);

  const checkReservation = () => {
    if (token) {
      if (reservationIdValidation(reservationId)) {
        setLoading(true);
        apiClient(process.env.REACT_APP_API_BASE_URL)
          .reservation.info._reservation_id(reservationId)
          .$get({
            headers: { Authorization: "Bearer " + token },
          })
          .then((res) => {
            setReservation(res);
          })
          .catch((err: AxiosError) => {
            handleApiError(err, "reservation_info_get");
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  };

  const registerNewWristband = () => {
    if (token && reservation) {
      if (guestIdValidation(newGuestId)) {
        setRegisterLoading(true);
        apiClient(process.env.REACT_APP_API_BASE_URL)
          .guest.revoke.$post({
            headers: { Authorization: "Bearer " + token },
            body: {
              reservation_id: reservationId,
              new_guest_id: newGuestId,
              old_guest_id: oldGuestId === "not-set" ? "" : oldGuestId,
              guest_type: reservation.guest_type,
              part: reservation.part,
            },
          })
          .then(() => {
            setDialogMessage("スペアの登録が完了しました。");
          })
          .catch((err: AxiosError) => {
            handleApiError(err, "guest_revoke_post");
          })
          .finally(() => {
            setRegisterLoading(false);
          });
      }
    }
  };

  const handleClose = () => {
    setDialogMessage(null);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ width: "min(100%, 300px)" }}>
            <TextField
              id="reservationId"
              label="予約ID"
              value={reservationId}
              onChange={(e) => setReservationId(e.target.value)}
              margin="normal"
              fullWidth
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  checkReservation();
                }
              }}
            />
            <Box sx={{ width: "100%", textAlign: "right" }}>
              {loading && <CircularProgress size={25} thickness={6} />}
              <Button
                onClick={checkReservation}
                disabled={loading || !reservationIdValidation(reservationId)}
                variant="contained"
              >
                予約を検索
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          {reservation && (
            <>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h4">予約情報</Typography>
                <List dense>
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
                        reservation.guest_type === "family"
                          ? "保護者"
                          : "その他"
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
                          {reservation.count - reservation.registered.length}
                          人）
                        </span>
                      )}
                    </ListItemText>
                  </ListItem>
                </List>
              </Card>
              <Card variant="outlined" sx={{ p: 2, mt: 2 }}>
                <Typography variant="h4">
                  紐付けられているリストバンド
                </Typography>
                <List dense>
                  {reservation.registered.map((guest) => (
                    <ListItem key={guest.guest_id}>
                      <ListItemIcon>
                        <PersonRoundedIcon />
                      </ListItemIcon>
                      <ListItemText>
                        {guest.guest_id}
                        {guest.is_spare === 1 && <span>(スペア)</span>}
                      </ListItemText>
                    </ListItem>
                  ))}
                </List>
              </Card>
            </>
          )}
        </Grid>
        {reservation && (
          <Grid item xs={12} md={6}>
            {reservation.registered.length === 0 && (
              <Alert severity="error" variant="filled" sx={{ mt: 2 }}>
                この予約IDに紐付けられたリストバンドはありません。
              </Alert>
            )}
            {reservation.registered.length !== 0 && (
              <Card variant="outlined" sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h4">
                      {reservation.reservation_id}へのゲストの登録と失効
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="newGuestId"
                      label="新しいゲストID"
                      disabled={registerLoading || !reservation}
                      value={newGuestId}
                      onChange={(e) => setNewGuestId(e.target.value)}
                      margin="normal"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="old-guest-label">
                        紛失したゲストID
                      </InputLabel>
                      <Select
                        labelId="old-guest-label"
                        id="oldGuestId"
                        value={oldGuestId}
                        disabled={registerLoading || !reservation}
                        label="紛失したゲストID"
                        onChange={(e) => setOldGuestId(e.target.value)}
                      >
                        <MenuItem value="not-set">不明</MenuItem>
                        {reservation &&
                          reservation.registered.map((guestId) => (
                            <MenuItem
                              key={guestId.guest_id}
                              value={guestId.guest_id}
                            >
                              {guestId.guest_id}{" "}
                              {guestId.is_spare === 1 && <span>(スペア)</span>}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: "1rem",
                    }}
                  >
                    {registerLoading && (
                      <CircularProgress size={25} thickness={6} />
                    )}
                    <Button
                      onClick={registerNewWristband}
                      disabled={
                        registerLoading || !reservation || newGuestId === ""
                      }
                      variant="contained"
                    >
                      登録
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            )}
          </Grid>
        )}
      </Grid>
      <MessageDialog
        open={dialogMessage !== null}
        type="success"
        message={dialogMessage as string}
        onClose={handleClose}
      />
    </>
  );
};

export default LostWristband;
