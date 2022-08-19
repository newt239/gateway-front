import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAtomValue } from "jotai";
import { tokenAtom, setTitle } from "#/components/lib/jotai";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";
import moment, { Moment } from "moment";

import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";

type ExhibitSummaryProp = {
  id: string;
  exhibit_name: string;
  group_name: string;
  room_name: string;
  exhibit_type: string;
  count: number;
  capacity: number;
};

const AnalyticsSummary = () => {
  setTitle("展示一覧");
  const token = useAtomValue(tokenAtom);
  const [clubList, setClubList] = useState<ExhibitSummaryProp[]>([]);
  const [classList, setClassList] = useState<ExhibitSummaryProp[]>([]);
  const [stageList, setStageList] = useState<ExhibitSummaryProp[]>([]);
  const [otherList, setOtherList] = useState<ExhibitSummaryProp[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Moment>(moment());
  const [loading, setLoading] = useState(true);

  const sortExhibitByCount = (a: ExhibitSummaryProp, b: ExhibitSummaryProp) => {
    if (a.count > b.count) return -1;
    if (a.count < b.count) return 1;
    return 0;
  };

  const getNowAllExhibit = () => {
    if (token) {
      setLoading(true);
      apiClient(process.env.REACT_APP_API_BASE_URL)
        .exhibit.current.$get({
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setClubList(
            res
              .filter((e) => e.exhibit_type === "club")
              .sort(sortExhibitByCount)
          );
          setClassList(
            res
              .filter((e) => e.exhibit_type === "class")
              .sort(sortExhibitByCount)
          );
          setStageList(
            res
              .filter((e) => e.exhibit_type === "stage")
              .sort(sortExhibitByCount)
          );
          setOtherList(
            res
              .filter((e) => e.exhibit_type === "other")
              .sort(sortExhibitByCount)
          );
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
    getNowAllExhibit();
    const intervalId = setInterval(() => {
      getNowAllExhibit();
    }, 1 * 60 * 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const ExhibitListBlock = ({ exhibit }: { exhibit: ExhibitSummaryProp }) => {
    return (
      <ListItem divider disablePadding>
        <Link
          to={`/analytics/exhibit/${exhibit.id}`}
          style={{ width: "100%", color: "black", textDecoration: "none", flexDirection: "column" }}
        >
          <Grid
            container
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "nowrap",
            }}
          >
            <Grid item>
              <ListItemText
                secondary={`${exhibit.group_name} ・ ${exhibit.room_name}`}
                secondaryTypographyProps={{ sx: { p: 0 } }}
              >
                {exhibit.exhibit_name}
              </ListItemText>
            </Grid>
            <Grid item>
              <span style={{ fontSize: "2rem", fontWeight: 800 }}>
                {exhibit.count}
              </span>{" "}
              /{exhibit.capacity}
            </Grid>
          </Grid>
          <LinearProgress
            variant="determinate"
            value={(exhibit.count / exhibit.capacity) * 100 || 1}
            sx={{
              width: "100%",
              height: 10,
              [`&.${linearProgressClasses.colorPrimary}`]: {
                backgroundColor: "transparent",
              },
              [`& .${linearProgressClasses.bar}`]: {
                borderRadius: 5,
                backgroundColor: "#1a90ff",
              },
            }}
          />
        </Link>
      </ListItem>
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h2">
          {lastUpdate.format("HH:mm:ss")} 現在
        </Typography>
        <Button
          onClick={getNowAllExhibit}
          disabled={loading}
          startIcon={<ReplayRoundedIcon />}
        >
          再読み込み
        </Button>
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography variant="h3">部活動</Typography>
        <List>
          {clubList.length === 0 ? (
            <>
              <Skeleton
                variant="rectangular"
                height="90vh"
                sx={{ borderRadius: ".5rem" }}
              />
            </>
          ) : (
            <>
              {clubList.map((exhibit) => (
                <ExhibitListBlock key={exhibit.id} exhibit={exhibit} />
              ))}
            </>
          )}
        </List>
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography variant="h3">クラス</Typography>
        <List>
          {classList.length === 0 ? (
            <>
              <Skeleton
                variant="rectangular"
                height="90vh"
                sx={{ borderRadius: ".5rem" }}
              />
            </>
          ) : (
            <>
              {classList.map((exhibit) => (
                <ExhibitListBlock key={exhibit.id} exhibit={exhibit} />
              ))}
            </>
          )}
        </List>
      </Grid>
      <Grid item xs={12} md={4}>
        <Grid container sx={{ flexDirection: "row" }}>
          <Grid item xs={12}>
            <Typography variant="h3">ステージ</Typography>
            <List>
              {stageList.length === 0 ? (
                <>
                  <Skeleton
                    variant="rectangular"
                    height="30vh"
                    sx={{ borderRadius: ".5rem" }}
                  />
                </>
              ) : (
                <>
                  {stageList.map((exhibit) => (
                    <ExhibitListBlock key={exhibit.id} exhibit={exhibit} />
                  ))}
                </>
              )}
            </List>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h3">その他</Typography>
            <List>
              {otherList.length === 0 ? (
                <>
                  <Skeleton
                    variant="rectangular"
                    height="50vh"
                    sx={{ borderRadius: ".5rem" }}
                  />
                </>
              ) : (
                <>
                  {otherList.map((exhibit) => (
                    <ExhibitListBlock key={exhibit.id} exhibit={exhibit} />
                  ))}
                </>
              )}
            </List>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AnalyticsSummary;
