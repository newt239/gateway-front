import React, { useEffect } from "react";
import { useSetAtom } from "jotai";
import { pageTitleAtom } from "#/components/lib/jotai";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Grid } from "@mui/material";
import AllAreaPieChart from "#/components/block/AllAreaPieChart";

import RealtimeLog from "#/components/block/RealtimeLog";

const AnalyticsIndex = () => {
  const setPageTitle = useSetAtom(pageTitleAtom);
  useEffect(() => {
    setPageTitle("滞在状況");
  }, []);

  const theme = useTheme();
  const smallerThanMD = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Grid container spacing={2} sx={{ py: 2, flexWrap: "nowrap", flexDirection: smallerThanMD ? "column-reverse" : "row" }}>
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
