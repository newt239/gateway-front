import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { pageStateSelector } from "#/recoil/page";
import { tokenState } from "#/recoil/user";

import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";
import moment, { Moment } from "moment";

const Summary = () => {
  const setPageInfo = useSetRecoilState(pageStateSelector);
  useEffect(() => {
    setPageInfo({ title: "展示一覧" });
  }, []);

  const token = useRecoilValue(tokenState);

  type exhibitProp = {
    id: string;
    exhibit_name: string;
    group_name: string;
    room_name: string;
    exhibit_type: string;
    position: string;
    count: number;
    capacity: number;
  };

  const [clubList, setClubList] = useState<exhibitProp[]>([]);
  const [classList, setClassList] = useState<exhibitProp[]>([]);
  const [stageList, setStageList] = useState<exhibitProp[]>([]);
  const [otherList, setOtherList] = useState<exhibitProp[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Moment>(moment());

  const sortExhibitByCount = (a: exhibitProp, b: exhibitProp) => {
    if (a.count > b.count) return -1;
    if (a.count < b.count) return 1;
    return 0;
  };

  const getNowAllExhibit = () => {
    if (token) {
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
        });
    }
  };

  useEffect(() => {
    getNowAllExhibit();
  }, [token]);

  const ExhibitListBlock = ({ exhibit }: { exhibit: exhibitProp }) => {
    return (
      <ListItem divider sx={{ flexDirection: "column" }} disablePadding>
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
              <Link
                to={`/chart/exhibit/${exhibit.id}`}
                style={{ color: "black", textDecoration: "none" }}
              >
                {exhibit.exhibit_name}
              </Link>
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
      </ListItem>
    );
  };

  return (
    <Grid container spacing={2} sx={{ pt: 2 }}>
      <Grid item xs={12}>
        滞在者数の多い順に表示しています。 最終更新：
        {lastUpdate.format("HH:mm:ss")}
        <IconButton size="small" color="primary" onClick={getNowAllExhibit}>
          <ReplayRoundedIcon />
        </IconButton>
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography variant="h3">部活動</Typography>
        <List>
          {clubList.map((exhibit) => (
            <ExhibitListBlock key={exhibit.id} exhibit={exhibit} />
          ))}
        </List>
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography variant="h3">クラス</Typography>
        <List>
          {classList.map((exhibit) => (
            <ExhibitListBlock key={exhibit.id} exhibit={exhibit} />
          ))}
        </List>
      </Grid>
      <Grid item xs={12} md={4}>
        <Grid container sx={{ flexDirection: "row" }}>
          <Grid item xs={12}>
            <Typography variant="h3">ステージ</Typography>
            <List>
              {stageList.map((exhibit) => (
                <ExhibitListBlock key={exhibit.id} exhibit={exhibit} />
              ))}
            </List>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h3">その他</Typography>
            <List>
              {otherList.map((exhibit) => (
                <ExhibitListBlock key={exhibit.id} exhibit={exhibit} />
              ))}
            </List>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Summary;
