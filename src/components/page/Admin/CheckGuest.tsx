import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { tokenState } from "#/recoil/user";
import { pageStateSelector } from "#/recoil/page";
import apiClient from "#/axios-config";
import moment from "moment";
import {
  Grid,
  Card,
  Typography,
  TextField,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import { guestInfoProp } from "#/types/global";
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';

const AdminCheckGuest = () => {
  const setPageInfo = useSetRecoilState(pageStateSelector);
  useEffect(() => {
    setPageInfo({ title: "ゲスト照会" });
  }, []);

  const token = useRecoilValue(tokenState);

  const [guestId, setGuestId] = useState("");
  const [guestInfo, setGuestInfo] = useState<guestInfoProp | null>(null);
  const [loading, setLoading] = useState(false);

  const [guestActivity, setGuestActivity] = useState([{
    datetime: "09:00", exhibit_id: "a", activity_type: "enter"
  }, {
    datetime: "10:00", exhibit_id: "a", activity_type: "exit"
  }]);

  const searchGuest = () => {
    if (token && !loading && guestId !== "") {
      setLoading(true);
      apiClient(process.env.REACT_APP_API_BASE_URL)
        .guest.info._guest_id(guestId)
        .$get({
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          setGuestInfo(res);
        })
        .catch((err) => {
          console.log(err);
        });
      apiClient(process.env.REACT_APP_API_BASE_URL)
        .guest.activity._guest_id(guestId).$get({
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          const guestActivityList = [];
          console.log(res)
          for (const eachSession of res) {
            guestActivityList.push({ datetime: eachSession.enter_at, exhibit_id: eachSession.exhibit_id, activity_type: "enter" })
            if (eachSession.exit_at !== "current") {
              guestActivityList.push({ datetime: eachSession.exit_at, exhibit_id: eachSession.exhibit_id, activity_type: "exit" })
            }
          }
          setGuestActivity(guestActivityList.sort((a, b) => (a.datetime < b.datetime) ? -1 : 1));
        })
        .catch((err) => {
          console.log(err);
        });
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12}>
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
      </Grid>
      <Grid item xs={12}>
        <Card variant="outlined" sx={{ p: 2 }}>
          <Timeline position="alternate">
            {guestActivity.map((v, i) => {
              return (
                <TimelineItem key={i}>
                  <TimelineOppositeContent color="text.secondary">
                    {moment(v.datetime).format("HH:mm:ss")}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>{`${v.exhibit_id} ${v.activity_type === "enter" ? "入室" : "退室"}`}</TimelineContent>
                </TimelineItem>
              )
            })}
          </Timeline>
        </Card>
      </Grid>
      <Grid item xs={12}>
        {guestInfo && (
          <Card variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h4">ゲスト種別</Typography>
            <Typography>{guestInfo.guest_type}</Typography>
            <Typography variant="h4">時間帯</Typography>
            <Typography>{guestInfo.part}</Typography>
            <Typography variant="h4">予約id</Typography>
            <Typography>{guestInfo.reservation_id}</Typography>
          </Card>
        )}
      </Grid>
    </Grid>
  );
};

export default AdminCheckGuest;
