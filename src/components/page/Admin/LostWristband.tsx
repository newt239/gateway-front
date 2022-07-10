import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { tokenState, profileState } from "#/recoil/user";
import { pageStateSelector } from "#/recoil/page";
import ReactGA from "react-ga4";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";
import {
  Grid,
  TextField,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";

const LostWristband = () => {
  const setPageInfo = useSetRecoilState(pageStateSelector);
  useEffect(() => {
    setPageInfo({ title: "リストバンド紛失" });
  }, []);

  const token = useRecoilValue(tokenState);
  const profile = useRecoilValue(profileState);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12}>
      </Grid>
    </Grid>
  );
};

export default LostWristband;
