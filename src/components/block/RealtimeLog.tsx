import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { tokenAtom } from "#/components/lib/jotai";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";
import moment, { Moment } from "moment";

import {
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";

const RealtimeLog = () => {
  const token = useAtomValue(tokenAtom);

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
  const [lastUpdate, setLastUpdate] = useState<Moment>(
    moment().subtract(1, "weeks")
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [maskId, setMaskId] = useState<boolean>(true);

  const getActivityHistory = () => {
    if (token && exhibitList) {
      setLoading(true);
      apiClient(process.env.REACT_APP_API_BASE_URL)
        .activity.history._from(moment(lastUpdate).format())
        .$get({
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const enterActivityList = res.enter.map((v) => {
            return { ...v, activity_type: "enter" };
          });
          const exitActivityList = res.exit.map((v) => {
            return { ...v, activity_type: "exit" };
          });
          const newActivityList = enterActivityList
            .concat(exitActivityList)
            .sort((a, b) => {
              if (a.timestamp < b.timestamp) {
                return 1;
              } else {
                return -1;
              }
            });
          setActivityList([
            ...activityList,
            ...newActivityList,
            ...activityList,
          ]);
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

  // 10秒ごとに自動で取得
  useEffect(() => {
    if (exhibitList.length !== 0) {
      getActivityHistory();
      const intervalId = setInterval(() => {
        getActivityHistory();
      }, 1 * 10 * 1000);
      return () => {
        clearInterval(intervalId);
      };
    } else {
      getExhibitList();
    }
  }, [exhibitList]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid
          container
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            height: 30,
          }}
        >
          <Grid item>
            <Tooltip title="10秒更新">
              <Typography variant="h3">リアルタイムログ</Typography>
            </Tooltip>
          </Grid>
          <Grid item>
            {loading && <CircularProgress size={25} thickness={6} />}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid
          container
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Grid item>
            <ListItem sx={{ p: 0 }}>
              <Switch
                edge="end"
                onChange={() => setMaskId((maskId) => !maskId)}
                checked={maskId}
              />
              <ListItemText>ゲストIDを隠す</ListItemText>
            </ListItem>
          </Grid>
          <Grid item>{lastUpdate.format("hh:mm:ss")}</Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {activityList.length !== 0 ? (
          <List>
            {activityList.map((v) => (
              <ListItem
                key={`${v.session_id}-${v.activity_type}`}
                divider
                disablePadding
              >
                <Grid container sx={{ alignItems: "center" }}>
                  <Grid item xs={2.5}>
                    <ListItemText>
                      {moment(v.timestamp).format("hh:mm:ss")}
                    </ListItemText>
                  </Grid>
                  <Grid item xs={4}>
                    <ListItemText
                      secondary={
                        maskId ? v.guest_id.slice(0, 6) + "____" : v.guest_id
                      }
                      secondaryTypographyProps={{ sx: { p: 0 } }}
                    >
                      {v.session_id}
                    </ListItemText>
                  </Grid>
                  <Grid item xs={4}>
                    <ListItemText>
                      {(exhibitList &&
                        exhibitList.filter((x) => {
                          return x.exhibit_id === v.exhibit_id;
                        })[0]?.exhibit_name) ||
                        "エントランス"}
                    </ListItemText>
                  </Grid>
                  <Grid item xs={1.5}>
                    <ListItemText>
                      {v.activity_type === "enter" ? "入室" : "退室"}
                    </ListItemText>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" sx={{ p: 2 }}>
            データがありません。
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default RealtimeLog;
