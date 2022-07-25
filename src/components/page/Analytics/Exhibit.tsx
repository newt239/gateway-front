import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { profileState, tokenState } from "#/recoil/user";
import { pageStateSelector } from "#/recoil/page";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";
import { Grid, Button, Typography } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

import ExhibitEnterCountBarChart from "../../block/ExhibitEnterCountBarChart";
import ExhibitCurrentGuestList from "#/components/block/ExhibitCurrentGuestList";

const AnalyticsExhibit = () => {
  const navigate = useNavigate();
  const token = useRecoilValue(tokenState);
  const profile = useRecoilValue(profileState);
  if (profile) {
    const exhibit_id =
      useParams<{ exhibit_id: string }>().exhibit_id ||
      profile.user_id ||
      "unknown";
    const [status, setStatus] = useState<{ status: boolean; message: string }>({
      status: false,
      message: "読込中...",
    });

    const setPageInfo = useSetRecoilState(pageStateSelector);

    useEffect(() => {
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
              setPageInfo({
                title: `${currentExhibit.group_name} - 現在の滞在状況`,
              });
            }
          })
          .catch((err: AxiosError) => {
            console.log(err);
            setPageInfo({ title: `${exhibit_id} - 現在の滞在状況` });
          });
      }
    }, []);

    useEffect(() => {
      if (profile) {
        if (exhibit_id === "") {
          navigate("/analytics/summary", { replace: true });
        } else {
          setStatus({ status: true, message: "" });
        }
      } else {
        setStatus({ status: false, message: "読込中..." });
      }
    }, [profile]);

    return (
      <>
        {status.status ? (
          <Grid container spacing={2} sx={{ p: 2 }}>
            {profile.user_type !== "exhibit" && (
              <Grid item xs={12}>
                <Button
                  variant="text"
                  startIcon={<ArrowBackIosNewRoundedIcon />}
                  onClick={() => navigate("/analytics/summary", { replace: true })}
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
        ) : (
          <>{status.message}</>
        )}
      </>
    );
  } else {
    return <></>;
  }
};

export default AnalyticsExhibit;
