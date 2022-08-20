import React from "react";
import { setTitle } from "#/components/lib/jotai";

import { Grid } from "@mui/material";
import AllAreaPieChart from "#/components/block/AllAreaPieChart";

import useDeviceWidth from "#/components/lib/useDeviceWidth";
import RealtimeLog from "#/components/block/RealtimeLog";

const AnalyticsIndex = () => {
  setTitle("滞在状況");
  const { largerThanMD } = useDeviceWidth();

  return (
    <Grid
      container
      spacing={2}
      sx={{
        flexWrap: "nowrap",
        flexDirection: largerThanMD ? "row" : "column-reverse",
      }}
    >
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
