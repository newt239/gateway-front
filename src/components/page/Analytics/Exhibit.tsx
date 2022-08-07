import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAtomValue, useSetAtom } from "jotai";
import { tokenAtom, profileAtom, pageTitleAtom } from "#/components/lib/jotai";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";
import { Grid, Button, Typography, CircularProgress } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

import ExhibitEnterCountBarChart from "../../block/ExhibitEnterCountBarChart";
import ExhibitCurrentGuestList from "#/components/block/ExhibitCurrentGuestList";

const AnalyticsExhibit = () => {
  const navigate = useNavigate();
  const token = useAtomValue(tokenAtom);
  const profile = useAtomValue(profileAtom);
  if (profile) {
    const pathMatchResult = useLocation().pathname.match(/exhibit\/(.*)/);
    const exhibit_id = pathMatchResult ? pathMatchResult[1] : "";

    const setPageTitle = useSetAtom(pageTitleAtom);
    useEffect(() => {
      setPageTitle(`${exhibit_id} - 現在の滞在状況`);
      if (token && profile) {
        apiClient(process.env.REACT_APP_API_BASE_URL)
          .exhibit.list.$get({
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            const currentExhibit = res.find((v) => v.exhibit_id === exhibit_id);
            if (currentExhibit) {
              setPageTitle(`${currentExhibit.exhibit_name} - 現在の滞在状況`);
            }
          })
          .catch((err: AxiosError) => {
            console.log(err);
          });
      }
    }, []);

    useEffect(() => {
      if (profile && exhibit_id === "") {
        if (profile.user_type === "moderator") {
          navigate("/analytics/summary", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    }, [profile]);

    return (
      <Grid container spacing={2} sx={{ py: 2 }}>
        {["moderator", "executive"].includes(profile.user_type) && (
          <Grid item xs={12}>
            <Button
              variant="text"
              startIcon={<ArrowBackIosNewRoundedIcon />}
              onClick={() =>
                navigate("/analytics/summary", { replace: true })
              }
            >
              一覧に戻る
            </Button>
          </Grid>
        )}
        <Grid item xs={12} lg={6}>
          <ExhibitCurrentGuestList exhibit_id={exhibit_id} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Typography variant="h3">時間帯別入場者数</Typography>
          <ExhibitEnterCountBarChart exhibit_id={exhibit_id} />
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Grid container spacing={2} sx={{ py: 2, alignItems: "center" }}>
        <Grid item>
          <CircularProgress />
        </Grid>
        <Grid item>
          <Typography variant="body1">セッション状態を確認中...</Typography>
        </Grid>
      </Grid>
    );
  }
};

export default AnalyticsExhibit;
