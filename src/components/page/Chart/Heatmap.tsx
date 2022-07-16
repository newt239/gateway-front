import React, { useEffect, useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { pageStateSelector } from "#/recoil/page";
import { tokenState } from "#/recoil/user";

import { Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { AxiosError } from "axios";
import apiClient from "#/axios-config";

const Heatmap = () => {
  const setPageInfo = useSetRecoilState(pageStateSelector);
  useEffect(() => {
    setPageInfo({ title: "ヒートマップ" });
  }, []);

  const token = useRecoilValue(tokenState);

  type exhibitProp = {
    id: string;
    exhibit_name: string;
    count: number;
    capacity: number;
  };

  const [floor1List, setFloor1List] = useState<exhibitProp[]>([]);

  useEffect(() => {
    if (token) {
      apiClient(process.env.REACT_APP_API_BASE_URL)
        .exhibit.current.$get({
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setFloor1List(res.sort((a, b) => {
            if (a.count > b.count) return -1;
            if (a.count < b.count) return 1;
            return 0;
          }));
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    }
  }, [token]);

  const ExhibitListBlock = ({ exhibit }: { exhibit: exhibitProp }) => {
    return (
      <ListItem divider sx={{ flexDirection: "column" }}>
        <Grid container sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Grid item><ListItemText>{exhibit.exhibit_name}</ListItemText></Grid>
          <Grid item><span style={{ fontSize: "2rem", fontWeight: 800 }}>{exhibit.count}</span> / {exhibit.capacity} 人</Grid>
        </Grid>
        <LinearProgress variant="determinate" value={exhibit.count / exhibit.capacity * 100} sx={{
          width: "100%", height: 10, [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: "transparent",
            borderRadius: 5
          },
          [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: '#1a90ff',
          },
        }} />
      </ListItem>
    )
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={6}>
        <Typography variant="h3">Floor 1</Typography>
        <List>
          {floor1List.map((exhibit) => (<ExhibitListBlock key={exhibit.id} exhibit={exhibit} />))}
        </List>
      </Grid>
    </Grid>
  );
};

export default Heatmap;
