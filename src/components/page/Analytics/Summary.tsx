import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAtomValue } from "jotai";
import { tokenAtom, setTitle } from "#/components/lib/jotai";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";
import moment, { Moment } from "moment";

import {
  Box,
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
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';

import { handleApiError } from "#/components/lib/commonFunction";

type ExhibitSummaryProps = {
  id: string;
  exhibit_name: string;
  group_name: string;
  room_name: string;
  exhibit_type: string;
  count: number;
  capacity: number;
};

const AnalyticsSummary: React.VFC = () => {
  setTitle("展示一覧");
  const token = useAtomValue(tokenAtom);
  const [exhibitList, setExhibitList] = useState<ExhibitSummaryProps[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Moment>(moment());
  const [loading, setLoading] = useState(true);
  const [expand, setExpand] = useState(false);
  const [asc, setAsc] = useState(true);
  const [pause, setPause] = useState(false);

  const sortExhibitByCount = (a: ExhibitSummaryProps, b: ExhibitSummaryProps) => {
    if (a.count !== b.count) {
      if (a.count > b.count) return asc ? -1 : 1;
      if (a.count < b.count) return asc ? 1 : -1;
    }
    if (a.id !== b.id) {
      if (a.id > b.id) return asc ? 1 : -1;
      if (a.id < b.id) return asc ? -1 : 1;
    }
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
          setExhibitList(res);
          setLastUpdate(moment());
        })
        .catch((err: AxiosError) => {
          handleApiError(err, "exhibit_current_get");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // 30秒ごとに昇順/降順切り替え、1分ごとに新たにデータを取得
  useEffect(() => {
    if (!pause) {
      getNowAllExhibit();
      const intervalId = setInterval(() => {
        if (!asc) {
          getNowAllExhibit();
        }
        setAsc(asc => !asc);
      }, 1 * 30 * 1000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [asc, pause]);

  const EachExhibit: React.VFC<{ exhibit: ExhibitSummaryProps }> = ({ exhibit }) => {
    const over = exhibit.count >= exhibit.capacity;
    return (
      <ListItem divider disablePadding sx={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
        <Link
          to={`/analytics/exhibit/${exhibit.id}`}
          style={{
            width: "100%",
            color: "black",
            textDecoration: "none",
            flexDirection: "column",
          }}
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
              <span style={{ fontSize: "2rem", fontWeight: 800, color: over ? "#d32f2f" : "black" }}>
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
                backgroundColor: over ? "#d32f2f" : "#1a90ff",
                borderRadius: 5,
              },
            }}
          />
        </Link>
      </ListItem>
    );
  };

  return (
    <Grid container spacing={2} sx={expand ? { position: "fixed", top: 0, left: 0, height: "100vh", overflowY: "scroll", backgroundColor: "white", my: 0, px: 1 } : null}>
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
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: ".5rem" }}>
          <Typography variant="body1">{asc ? "昇順" : "降順"}で表示中</Typography>
          <Button
            onClick={getNowAllExhibit}
            disabled={loading || pause}
            startIcon={<ReplayRoundedIcon />}
          >
            再読み込み
          </Button>
          <Button
            onClick={() => setPause((pause) => !pause)}
            startIcon={pause ? <PlayArrowRoundedIcon /> : <PauseRoundedIcon />}
          >
            {pause ? "更新を再開" : "更新を停止"}
          </Button>
          <Button
            onClick={() => setExpand((expand) => !expand)}
            startIcon={<OpenInFullRoundedIcon />}
          >
            {expand ? "縮小" : "拡大"}
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12} md={3}>
        <Typography variant="h3">部活動</Typography>
        <List sx={{ columnCount: 1, height: "90vh", overflowX: "scroll" }}>
          {exhibitList.length === 0 ? (
            <Skeleton variant="rounded" height="90vh" />
          ) : (
            <>
              {exhibitList.filter((e) => e.exhibit_type === "club")
                .sort(sortExhibitByCount).map((exhibit) => (
                  <EachExhibit key={exhibit.id} exhibit={exhibit} />
                ))}
            </>
          )}
        </List>
      </Grid>
      <Grid item xs={12} md={6} >
        <Typography variant="h3">クラス</Typography>
        <List sx={{ columnCount: 2, height: "90vh", overflowX: "scroll" }}>
          {exhibitList.length === 0 ? (
            <Skeleton variant="rounded" height="180vh" />
          ) : (
            <>
              {exhibitList.filter((e) => e.exhibit_type === "class")
                .sort(sortExhibitByCount).map((exhibit) => (
                  <EachExhibit key={exhibit.id} exhibit={exhibit} />
                ))}
            </>
          )}
        </List>
      </Grid>
      <Grid item xs={12} md={3}>
        <Typography variant="h3">ステージ・その他の展示</Typography>
        <List sx={{ columnCount: 1, height: "90vh", overflowX: "scroll" }}>
          {exhibitList.length === 0 ? (
            <Skeleton variant="rounded" height="90vh" />
          ) : (
            <>
              {exhibitList.filter((e) => ["stage", "other"].indexOf(e.exhibit_type) !== -1)
                .sort(sortExhibitByCount).map((exhibit) => (
                  <EachExhibit key={exhibit.id} exhibit={exhibit} />
                ))}
            </>
          )}
        </List>
      </Grid>
    </Grid>
  );
};

export default AnalyticsSummary;
