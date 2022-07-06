import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { tokenState, profileState } from "#/recoil/user";
import { pageStateSelector } from "#/recoil/page";
import ReactGA from "react-ga4";
import { AxiosError } from "axios";
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { guestInfoProp } from "#/types/global";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

type exhibitProp = {
  exhibit_id: string;
  group_name: string;
  exhibit_type: string;
};

const AdminCheckGuest = () => {
  const setPageInfo = useSetRecoilState(pageStateSelector);
  useEffect(() => {
    setPageInfo({ title: "ゲスト照会" });
  }, []);

  const token = useRecoilValue(tokenState);
  const profile = useRecoilValue(profileState);

  const [guestId, setGuestId] = useState("");
  const [guestInfo, setGuestInfo] = useState<guestInfoProp | null>(null);
  const [loading, setLoading] = useState(false);
  const [exhibitList, setExhibitList] = useState<exhibitProp[]>([]);

  useEffect(() => {
    if (token) {
      apiClient(process.env.REACT_APP_API_BASE_URL)
        .exhibit.list.$get({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setExhibitList(res);
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    }
  }, [token]);

  type guestActivityParams = {
    datetime: string;
    exhibit_id: string;
    activity_type: string;
  }[];
  const [guestActivity, setGuestActivity] = useState<guestActivityParams>([]);

  const searchGuest = () => {
    if (token && profile && !loading && guestId !== "") {
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
        .guest.activity._guest_id(guestId)
        .$get({
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          const guestActivityList = [];
          console.log(res);
          for (const eachSession of res) {
            guestActivityList.push({
              datetime: eachSession.enter_at,
              exhibit_id: eachSession.exhibit_id,
              activity_type: "enter",
            });
            if (eachSession.exit_at !== "current") {
              guestActivityList.push({
                datetime: eachSession.exit_at,
                exhibit_id: eachSession.exhibit_id,
                activity_type: "exit",
              });
            }
          }
          setGuestActivity(
            guestActivityList.sort((a, b) => (a.datetime < b.datetime ? -1 : 1))
          );
        })
        .catch((err) => {
          console.log(err);
        }).finally(() => {
          ReactGA.event({
            category: "info",
            action: "guest_activity_request",
            label: profile.user_id,
          });
        });
      setLoading(false);
    }
  };

  const getExhibitName = (exhibit_id: string) => {
    const exhibit = exhibitList.find(v => v.exhibit_id === v.exhibit_id);
    if (exhibit_id === "entrance") {
      return "エントランス"
    } else if (exhibit) {
      return exhibit.group_name
    } else {
      return exhibit_id
    }
  }

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12}>
        <TextField
          id="guestId"
          label="ゲストID"
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
      {guestInfo && (
        <>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h3">行動履歴</Typography>
              <Timeline position="alternate">
                {guestActivity.map((v, i) => {
                  return (
                    <TimelineItem key={i}>
                      <TimelineOppositeContent color="text.secondary">
                        {moment(v.datetime).format("HH:mm:ss")}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot color="primary" />
                        {v.activity_type === "enter" ? (
                          <TimelineConnector sx={{ bgcolor: "primary.main" }} />
                        ) : (
                          <TimelineConnector />
                        )}
                      </TimelineSeparator>
                      {v.activity_type === "enter" ? (
                        <TimelineContent>{getExhibitName(v.exhibit_id)}</TimelineContent>
                      ) : (
                        <TimelineContent>退室</TimelineContent>
                      )}
                    </TimelineItem>
                  );
                })}
              </Timeline>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h3">ゲスト情報</Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <PersonRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary={guestInfo.guest_id} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AssignmentIndRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary={guestInfo.reservation_id} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PeopleRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary={guestInfo.guest_type} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary={guestInfo.part} />
                </ListItem>
              </List>
            </Card>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default AdminCheckGuest;
