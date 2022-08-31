import React from "react";
import { setTitle } from "#/components/lib/jotai";

import { Grid } from "@mui/material";
import AllAreaPieChart from "#/components/block/AllAreaPieChart";

import useDeviceWidth from "#/components/lib/useDeviceWidth";
import RealtimeLog from "#/components/block/RealtimeLog";

const AnalyticsIndex: React.VFC = () => {
  setTitle("滞在状況");
  const { largerThanLG } = useDeviceWidth();

  return (
    <Grid
      container
      spacing={2}
      sx={{
        flexWrap: "nowrap",
        flexDirection: largerThanLG ? "row" : "column-reverse",
        justifyContent: "space-between",
      }}
    >
      <Grid item xs={12} lg={7}>
        <RealtimeLog />
      </Grid>
      <Grid item xs={12} lg={4}>
        <AllAreaPieChart />
      </Grid>
    </Grid>
  );
};

export default AnalyticsIndex;
