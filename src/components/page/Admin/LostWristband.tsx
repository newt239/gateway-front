import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { tokenState } from "#/recoil/user";
import { reservationState } from "#/recoil/reservation";
import { pageStateSelector } from "#/recoil/page";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";
import { Grid, TextField, Box, Button, CircularProgress } from "@mui/material";

import MessageDialog from "#/components/block/MessageDialog";

const LostWristband = () => {
  const setPageInfo = useSetRecoilState(pageStateSelector);
  useEffect(() => {
    setPageInfo({ title: "リストバンド紛失" });
  }, []);

  const token = useRecoilValue(tokenState);

  const [reservationId, setReservationId] = useState("");
  const [reservation, setReservation] = useRecoilState(reservationState);
  const [newGuestId, setNewGuestId] = useState("");
  const [loading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState<string[]>([]);

  const checkReservation = () => {
    if (token && reservationId.length === 7 && reservationId.startsWith("R")) {
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
  };

  const registNewWristband = () => {
    if (
      token &&
      reservation &&
      newGuestId.length === 10 &&
      newGuestId.startsWith("G")
    ) {
      setLoading(true);
      apiClient(process.env.REACT_APP_API_BASE_URL)
        .guest.revoke.$post({
          headers: { Authorization: "Bearer " + token },
          body: {
            reservation_id: reservationId,
            guest_id: newGuestId,
            guest_type: reservation.guest_type,
            part: reservation.part,
          },
        })
        .then((res) => {
          console.log(res);
          setDialogOpen(true);
          setDialogMessage([`スペアの登録が完了しました`]);
        })
        .catch((err: AxiosError) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setDialogMessage([]);
  };

  return (
    <>
      <Grid container spacing={2} sx={{ p: 2 }}>
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
          <Box>
            <Button
              onClick={checkReservation}
              disabled={loading || reservationId === ""}
              variant="contained"
              startIcon={loading && <CircularProgress size={24} />}
            >
              予約を検索
            </Button>
          </Box>
        </Grid>
        {reservation && (
          <Grid item xs={12}>
            <p>{reservationId}は存在します。</p>
          </Grid>
        )}
        <Grid item xs={12}>
          <TextField
            id="newGuestId"
            label="新しいゲストID"
            value={newGuestId}
            onChange={(e) => setNewGuestId(e.target.value)}
            margin="normal"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Box>
            <Button
              onClick={registNewWristband}
              disabled={loading || !reservation || newGuestId === ""}
              variant="contained"
              startIcon={loading && <CircularProgress size={24} />}
            >
              登録
            </Button>
          </Box>
        </Grid>
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
