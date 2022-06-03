import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { tokenState } from "#/recoil/user";
import { pageStateSelector } from "#/recoil/page";
import apiClient from '#/axios-config';

import {
  Grid,
  Card,
  Typography,
  TextField,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import { guestInfoProp } from "#/types/guests";


const AdminCheckGuest = () => {
  const setPageInfo = useSetRecoilState(pageStateSelector);
  useEffect(() => {
    setPageInfo({ title: "ゲスト照会" });
  }, []);

  const token = useRecoilValue(tokenState);

  const [guestId, setGuestId] = useState("");
  const [guestInfo, setGuestInfo] = useState<guestInfoProp | null>(null);
  const [loading, setLoading] = useState(false);

  const searchGuest = () => {
    if (token && !loading && guestId !== "") {
      setLoading(true);
      apiClient(process.env.REACT_APP_API_BASE_URL).guest.info._guest_id(guestId).$get({
        headers: { Authorization: "Bearer " + token },
      })
        .then((res) => {
          setGuestInfo(res);
        })
        .catch((err) => {
          console.log(err);
        });
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={6}>
        <Card variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h3">ゲスト情報</Typography>
          <TextField
            id="guestId"
            label="ゲストid"
            value={guestId}
            onChange={(e) => setGuestId(e.target.value)}
            margin="normal"
            fullWidth
          />
          <Box sx={{ width: "100%", textAlign: "right" }}>
            <Button
              onClick={searchGuest}
              disabled={loading || guestId === ""}
              variant="contained"
              startIcon={loading && <CircularProgress size={24} />}
            >
              検索
            </Button>
          </Box>
          {guestInfo && (
            <>
              <Typography variant="h4">ゲスト種別</Typography>
              <Typography>{guestInfo.guest_type}</Typography>
              <Typography variant="h4">時間帯</Typography>
              <Typography>{guestInfo.part}</Typography>
              <Typography variant="h4">予約id</Typography>
              <Typography>{guestInfo.reservation_id}</Typography>
            </>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default AdminCheckGuest;
