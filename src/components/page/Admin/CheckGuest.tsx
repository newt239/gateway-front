import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { tokenAtom, profileAtom, setTitle } from "#/components/lib/jotai";
import ReactGA from "react-ga4";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";
import moment, { Moment } from "moment";

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
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

import { ExhibitProps, GuestInfoProps } from "#/components/lib/types";
import {
  getTimePart,
  guestIdValidation,
  handleApiError,
} from "#/components/lib/commonFunction";

type GuestActivityProps = {
  datetime: Moment;
  exhibit_id: string;
  activity_type: string;
};

const AdminCheckGuest: React.VFC = () => {
  setTitle("ゲスト照会");
  const token = useAtomValue(tokenAtom);
  const profile = useAtomValue(profileAtom);
  const [guestId, setGuestId] = useState<string>("");
  const [guestInfo, setGuestInfo] = useState<GuestInfoProps | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [exhibitList, setExhibitList] = useState<ExhibitProps[]>([]);
  const [guestActivity, setGuestActivity] = useState<GuestActivityProps[]>([]);

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
          handleApiError(err, "exhibit_list_get");
        });
    }
  }, [token]);

  const searchGuest = () => {
    if (token && profile && !loading) {
      if (guestIdValidation(guestId)) {
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
            for (const eachSession of res) {
              console.log(eachSession);
              guestActivityList.push({
                datetime: moment(eachSession.enter_at),
                exhibit_id: eachSession.exhibit_id,
                activity_type: "enter",
              });
              if (eachSession.exit_at !== "current") {
                guestActivityList.push({
                  datetime: moment(eachSession.exit_at),
                  exhibit_id: eachSession.exhibit_id,
                  activity_type: "exit",
                });
              }
            }
            setGuestActivity(
              guestActivityList.sort((a, b) =>
                a.datetime < b.datetime ? -1 : 1
              )
            );
          })
          .catch((err: AxiosError) => {
            handleApiError(err, "guest_activity_get");
          })
          .finally(() => {
            ReactGA.event({
              category: "info",
              action: "guest_activity_request",
              label: profile.user_id,
            });
          });
        setLoading(false);
      }
    }
  };

  const getExhibitName = (exhibit_id: string) => {
    const exhibit = exhibitList.find((v) => v.exhibit_id === v.exhibit_id);
    if (exhibit_id === "entrance") {
      return "エントランス";
    } else if (exhibit) {
      return exhibit.group_name;
    } else {
      return exhibit_id;
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          id="guestId"
          label="ゲストID"
          value={guestId}
          onChange={(e) => setGuestId(e.target.value)}
          margin="normal"
          fullWidth
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "1rem",
          }}
        >
          {loading && <CircularProgress size={25} thickness={6} />}
          <Button
            onClick={searchGuest}
            disabled={loading || !guestIdValidation(guestId)}
            variant="contained"
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
                        {v.datetime.format("MM/DD HH:mm:ss")}
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
                        <TimelineContent>
                          {getExhibitName(v.exhibit_id)}
                        </TimelineContent>
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
                  <ListItemText>{guestInfo.guest_id}</ListItemText>
                </ListItem>
                {guestInfo.guest_type === "family" && (
                  <ListItem>
                    <ListItemIcon>
                      <AssignmentIndRoundedIcon />
                    </ListItemIcon>
                    <ListItemText>{guestInfo.reservation_id}</ListItemText>
                  </ListItem>
                )}
                <ListItem>
                  <ListItemIcon>
                    <PeopleRoundedIcon />
                  </ListItemIcon>
                  <ListItemText>
                    {guestInfo.guest_type === "family"
                      ? "保護者"
                      : guestInfo.guest_type === "student"
                      ? "生徒"
                      : guestInfo.guest_type === "teacher"
                      ? "教員"
                      : "その他"}
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeRoundedIcon />
                  </ListItemIcon>
                  <ListItemText>
                    {getTimePart(guestInfo.part).part_name}
                  </ListItemText>
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
