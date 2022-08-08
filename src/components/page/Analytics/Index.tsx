import React, { useEffect } from "react";
import { useSetAtom } from "jotai";
import { pageTitleAtom } from "#/components/lib/jotai";

import { Grid } from "@mui/material";
import AllAreaPieChart from "#/components/block/AllAreaPieChart";

import RealtimeLog from "#/components/block/RealtimeLog";

const AnalyticsIndex = () => {
  const setPageTitle = useSetAtom(pageTitleAtom);
  useEffect(() => {
    setPageTitle("滞在状況");
  }, []);

  return (
    <Grid container spacing={2} sx={{ py: 2 }}>
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
