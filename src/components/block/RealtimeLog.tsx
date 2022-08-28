import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { tokenAtom } from "#/components/lib/jotai";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";
import moment, { Moment } from "moment";

import {
  CircularProgress,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";

import { ExhibitProps } from "#/components/lib/types";
import { handleApiError } from "#/components/lib/commonFunction";

const RealtimeLog: React.VFC = () => {
  const token = useAtomValue(tokenAtom);
  const [exhibitList, setExhibitList] = useState<ExhibitProps[]>([]);
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
          handleApiError(err, "exhibit_list_get");
        });
    }
  };

  type ActivityProps = {
    activity_id: number;
    guest_id: string;
    exhibit_id: string;
    activity_type: string;
    timestamp: string;
  };
  const [activityList, setActivityList] = useState<ActivityProps[]>([]);
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
          const newActivityList = res
            .map((v) => {
              return { ...v, activity_type: "enter" };
            })
            .sort((a, b) => {
              if (a.timestamp < b.timestamp) {
                return 1;
              } else {
                return -1;
              }
            });
          setActivityList([...activityList, ...newActivityList]);
          setLastUpdate(moment());
        })
        .catch((err: AxiosError) => {
          handleApiError(err, "activity_history_get");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // 15秒ごとに自動で取得
  useEffect(() => {
    if (exhibitList.length !== 0) {
      getActivityHistory();
      const intervalId = setInterval(() => {
        getActivityHistory();
      }, 1 * 15 * 1000);
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
            <Tooltip title="15秒更新">
              <Typography variant="h3">リアルタイムログ</Typography>
            </Tooltip>
          </Grid>
          <Grid item>
            {loading && <CircularProgress size={25} thickness={6} />}
          </Grid>
        </Grid>
      </Grid>
      {activityList.length !== 0 ? (
        <>
          <Grid item xs={12}>
            <Grid
              container
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Grid item sx={{ px: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      edge="start"
                      onChange={() => setMaskId((maskId) => !maskId)}
                      checked={maskId}
                      sx={{ mr: 1 }}
                    />
                  }
                  label="ゲストIDを隠す"
                />
              </Grid>
              <Grid item>{lastUpdate.format("HH:mm:ss")}</Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <List>
              {activityList.map((v) => (
                <ListItem
                  key={`${v.activity_id}-${v.activity_type}`}
                  divider
                  disablePadding
                >
                  <Grid container sx={{ alignItems: "center" }}>
                    <Grid item xs={2.5}>
                      <ListItemText>
                        {moment(v.timestamp).format("HH:mm:ss")}
                      </ListItemText>
                    </Grid>
                    <Grid item xs={4}>
                      <ListItemText
                        secondary={
                          maskId ? v.guest_id.slice(0, 6) + "____" : v.guest_id
                        }
                        secondaryTypographyProps={{ sx: { p: 0 } }}
                      >
                        {v.activity_id}
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
          </Grid>
        </>
      ) : (
        <Typography variant="body1" sx={{ m: 2 }}>
          データがありません。
        </Typography>
      )}
    </Grid>
  );
};

export default RealtimeLog;
