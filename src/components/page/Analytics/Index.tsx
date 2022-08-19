import React, { useEffect } from "react";
import { useSetAtom } from "jotai";
import { pageTitleAtom } from "#/components/lib/jotai";

import { Grid } from "@mui/material";
import AllAreaPieChart from "#/components/block/AllAreaPieChart";

import useDeviceWidth from "#/components/lib/useDeviceWidth";
import RealtimeLog from "#/components/block/RealtimeLog";


const AnalyticsIndex = () => {
  const setPageTitle = useSetAtom(pageTitleAtom);
  useEffect(() => {
    setPageTitle("滞在状況");
  }, []);

  const { largerThanMD } = useDeviceWidth();

  return (
    <Grid container spacing={2} sx={{ py: 2, flexWrap: "nowrap", flexDirection: largerThanMD ? "row" : "column-reverse" }}>
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
