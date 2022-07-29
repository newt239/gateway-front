import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { tokenState } from "#/recoil/user";
import { } from "#/recoil/exhibit";

import {
  Card,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";
import moment, { Moment } from "moment";

const RealtimeLog = () => {
  const token = useRecoilValue(tokenState);

  type exhibitProp = {
    exhibit_id: string;
    exhibit_name: string;
    exhibit_type: string;
    group_name: string;
  };
  const [exhibitList, setExhibitList] = useState<exhibitProp[]>([]);
  const getExhibitList = () => {
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
  };

  type activityProp = {
    session_id: string;
    exhibit_id: string;
    guest_id: string;
    activity_type: string;
    timestamp: string;
  };
  const [activityList, setActivityList] = useState<activityProp[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Moment>(moment().subtract(1, "months"));
  const [loading, setLoading] = useState(true);

  const getActivityHistory = (from: Moment) => {
    if (token && exhibitList) {
      setLoading(true);
      apiClient(process.env.REACT_APP_API_BASE_URL)
        .activity.history._from(moment(from).format()).$get({
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const enterActivityList = res.enter.map(v => {
            return { ...v, activity_type: "enter" }
          });
          const exitActivityList = res.exit.map(v => {
            return { ...v, activity_type: "exit" }
          });
          const newActivityList = enterActivityList.concat(exitActivityList).sort((a, b) => {
            if (a.timestamp < b.timestamp) {
              return 1
            } else {
              return -1
            }
          });
          console.log(newActivityList);
          setActivityList([...newActivityList, ...activityList]);
          setLastUpdate(moment());
        })
        .catch((err: AxiosError) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // 1分ごとに自動で取得
  useEffect(() => {
    if (exhibitList.length !== 0) {
      getActivityHistory(lastUpdate);
      console.log(exhibitList);
      const intervalId = setInterval(() => {
        getActivityHistory(lastUpdate);
      }, 1 * 60 * 1000);
      return () => {
        clearInterval(intervalId);
      };
    } else {
      getExhibitList();
    }
  }, [exhibitList]);

  return (
    <>
      {exhibitList.length !== 0 && activityList.length !== 0 && (
        <Card variant="outlined">
          <List sx={{ p: 1 }}>
            {activityList.map(v => (
              <ListItem divider disablePadding key={`${v.session_id}-${v.activity_type}`}>
                <Grid container sx={{ alignItems: "center" }}>
                  <Grid item xs={2}>
                    <ListItemText>
                      {moment(v.timestamp).format("hh:mm:ss")}
                    </ListItemText>
                  </Grid>
                  <Grid item xs={4}>
                    <ListItemText secondary={v.guest_id} secondaryTypographyProps={{ sx: { p: 0 } }}>
                      {v.session_id}
                    </ListItemText>
                  </Grid>
                  <Grid item xs={4}>
                    <ListItemText>
                      {exhibitList.filter(x => {
                        return x.exhibit_id === v.exhibit_id
                      }).map(l => {
                        return <span key={l.exhibit_id}>{l.exhibit_name}</span>
                      })}
                    </ListItemText>
                  </Grid>
                  <Grid item xs={2}>
                    <ListItemText>
                      {v.activity_type === "enter" ? "入室" : "退室"}
                    </ListItemText>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
        </Card>
      )}
    </>
  );
};

export default RealtimeLog;
