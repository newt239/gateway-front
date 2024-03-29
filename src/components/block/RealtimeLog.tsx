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
import useDeviceWidth from "#/components/lib/useDeviceWidth";

const RealtimeLog: React.VFC = () => {
  const { largerThanSM } = useDeviceWidth();
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
          const newActivityList = res.sort((a, b) => {
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
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 30,
        }}
      >
        <Tooltip title="15秒更新">
          <Typography variant="h3">リアルタイムログ</Typography>
        </Tooltip>
        {loading && <CircularProgress size={25} thickness={6} />}
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
                {largerThanSM && localStorage.getItem("viewOnly") !== "yes" && (
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
                )}
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
                  <Grid
                    container
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Grid item xs={3.5} sm={2}>
                      <ListItemText>
                        {moment(v.timestamp).format("HH:mm:ss")}
                      </ListItemText>
                    </Grid>
                    {largerThanSM && (
                      <Grid item sm={4}>
                        <ListItemText
                          secondary={v.activity_id}
                          secondaryTypographyProps={{ p: 0 }}
                        >
                          {maskId
                            ? v.guest_id.slice(0, 6) + "____"
                            : v.guest_id}
                        </ListItemText>
                      </Grid>
                    )}
                    <Grid item xs={7} sm={4}>
                      <ListItemText>
                        {(exhibitList &&
                          exhibitList.filter((x) => {
                            return x.exhibit_id === v.exhibit_id;
                          })[0]?.exhibit_name) ||
                          "エントランス"}
                      </ListItemText>
                    </Grid>
                    <Grid
                      item
                      xs={1.5}
                      sm={1}
                      sx={{ whiteSpace: "nowrap", textAlign: "right" }}
                    >
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
      ) : loading ? (
        <Typography variant="body1" sx={{ p: 2 }}>
          読み込み中...
        </Typography>
      ) : (
        <Typography variant="body1" sx={{ m: 2 }}>
          データがありません。
        </Typography>
      )}
    </Grid>
  );
};

export default RealtimeLog;
