import React, { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { tokenAtom, pageTitleAtom } from "#/components/lib/jotai";
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
  Divider,
} from "@mui/material";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import GroupWorkRoundedIcon from "@mui/icons-material/GroupWorkRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

import { reservationInfoProp } from "#/components/lib/types";
import {
  getTimePart,
  guestIdValidation,
  reservationIdValidation,
} from "#/components/lib/commonFunction";
import MessageDialog from "#/components/block/MessageDialog";

const LostWristband = () => {
  const setPageTitle = useSetAtom(pageTitleAtom);
  useEffect(() => {
    setPageTitle("リストバンド紛失");
  }, []);

  const token = useAtomValue(tokenAtom);

  const [reservationId, setReservationId] = useState("");
  const [reservation, setReservation] = useState<reservationInfoProp | null>(
    null
  );
  const [newGuestId, setNewGuestId] = useState("");
  const [oldGuestId, setOldGuestId] = useState("not-set");
  const [loading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState<string>("");

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
            console.log(res);
            setReservation(res);
          })
          .catch((err: AxiosError) => {
            console.log(err);
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
        setLoading(true);
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
          .then((res) => {
            console.log(res);
            setDialogOpen(true);
            setDialogMessage("スペアの登録が完了しました。");
          })
          .catch((err: AxiosError) => {
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setDialogMessage("");
  };

  return (
    <>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="reservationId"
                label="予約ID"
                value={reservationId}
                onChange={(e) => setReservationId(e.target.value)}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ width: "100%", textAlign: "right" }}>
                {loading && <CircularProgress size={24} />}
                <Button
                  onClick={checkReservation}
                  disabled={loading || !reservationIdValidation(reservationId)}
                  variant="contained"
                >
                  予約を検索
                </Button>
              </Box>
            </Grid>
            {reservation && reservationId === reservation.reservation_id && (
              <Grid item xs={12}>
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
                        {reservation.count !==
                          reservation.registered.length && (
                            <span>
                              （残り：
                              {reservation.count - reservation.registered.length}
                              人）
                            </span>
                          )}
                      </ListItemText>
                    </ListItem>
                    <Divider />
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
              </Grid>
            )}
          </Grid>
        </Grid>
        {reservation && (
          <Grid item xs={12} md={6}>
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
                    disabled={loading || !reservation}
                    value={newGuestId}
                    onChange={(e) => setNewGuestId(e.target.value)}
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="old-guest-label">
                      紛失したゲストID(省略可)
                    </InputLabel>
                    <Select
                      labelId="old-guest-label"
                      id="oldGuestId"
                      value={oldGuestId}
                      disabled={loading || !reservation}
                      label="紛失したゲストID(省略可)"
                      onChange={(e) => setOldGuestId(e.target.value)}
                    >
                      <MenuItem value="not-set">未選択</MenuItem>
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
                <Grid item xs={12}>
                  <Box sx={{ width: "100%", textAlign: "right" }}>
                    <Button
                      onClick={registerNewWristband}
                      disabled={loading || !reservation || newGuestId === ""}
                      variant="contained"
                      startIcon={loading && <CircularProgress size={24} />}
                    >
                      登録
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        )}
      </Grid>
      <MessageDialog
        open={dialogOpen}
        type="success"
        message={dialogMessage}
        onClose={handleClose}
      />
    </>
  );
};

export default LostWristband;
