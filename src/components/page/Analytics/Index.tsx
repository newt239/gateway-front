import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { pageStateSelector } from "#/recoil/page";
import AllAreaPieChart from "#/components/block/AllAreaPieChart";
import { Grid } from "@mui/material";
import RealtimeLog from "#/components/block/RealtimeLog";

const AnalyticsIndex = () => {
  const setPageInfo = useSetRecoilState(pageStateSelector);
  useEffect(() => {
    setPageInfo({ title: "滞在状況" });
  }, []);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={8}>
        <RealtimeLog />
      </Grid>
      <Grid item xs={12} md={4}>
        <AllAreaPieChart />
      </Grid>
    </Grid>
  );
};

export default AnalyticsIndex;
