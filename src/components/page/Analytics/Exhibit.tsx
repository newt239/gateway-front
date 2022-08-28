import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAtomValue, useSetAtom } from "jotai";
import { tokenAtom, profileAtom, pageTitleAtom } from "#/components/lib/jotai";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";

import { Grid, Button, Typography, Card, Box } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import useDeviceWidth from "#/components/lib/useDeviceWidth";
import { handleApiError } from "#/components/lib/commonFunction";
import ExhibitEnterCountBarChart from "#/components/block/ExhibitEnterCountBarChart";
import ExhibitCurrentGuestList from "#/components/block/ExhibitCurrentGuestList";

const AnalyticsExhibit: React.VFC = () => {
  const { largerThanSM } = useDeviceWidth();
  const setTitle = useSetAtom(pageTitleAtom);
  const navigate = useNavigate();
  const token = useAtomValue(tokenAtom);
  const profile = useAtomValue(profileAtom);
  const { exhibitId } = useParams() as { exhibitId: string };

  useEffect(() => {
    setTitle(`${exhibitId} - 現在の滞在状況`);
    if (token && profile) {
      if (exhibitId === "") {
        if (profile.user_type === "moderator") {
          navigate("/analytics/summary", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else if (
        profile.user_type === "exhibit" &&
        profile.user_id !== exhibitId
      ) {
        navigate("/", { replace: true });
      } else {
        apiClient(process.env.REACT_APP_API_BASE_URL)
          .exhibit.list.$get({
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            const currentExhibit = res.find((v) => v.exhibit_id === exhibitId);
            if (currentExhibit) {
              setTitle(`${currentExhibit.exhibit_name} - 現在の滞在状況`);
            }
          })
          .catch((err: AxiosError) => {
            handleApiError(err, "exhibit_list_get");
          });
      }
    }
  }, []);

  return (
    <>
      {profile?.user_type === "exhibit" && profile?.user_id !== exhibitId ? (
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ p: 2 }}>
              このページを表示する権限がありません。
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sx={{
              width: "100%",
              display: "flex",
              overflowX: "scroll",
              flexDirection: "row",
              justifyContent: largerThanSM ? "flex-end" : "flex-start",
              alignItems: "center",
              whiteSpace: "nowrap",
              gap: 1,
              py: 1,
            }}
          >
            <Box sx={{ display: "flex" }}>
              {profile?.user_type === "moderator" && (
                <Button
                  size="small"
                  startIcon={<ArrowBackIosNewRoundedIcon />}
                  onClick={() =>
                    navigate("/analytics/summary", { replace: true })
                  }
                >
                  一覧に戻る
                </Button>
              )}
              <Button
                size="small"
                startIcon={<LoginRoundedIcon />}
                onClick={() =>
                  navigate(`/exhibit/${exhibitId}/enter`, { replace: true })
                }
              >
                入室スキャン
              </Button>
              <Button
                size="small"
                startIcon={<LogoutRoundedIcon />}
                onClick={() =>
                  navigate(`/exhibit/${exhibitId}/exit`, { replace: true })
                }
              >
                退室スキャン
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} lg={6}>
            <ExhibitCurrentGuestList exhibit_id={exhibitId} />
          </Grid>
          <Grid item xs={12} lg={6}>
            <Typography variant="h3">時間帯別入場者数</Typography>
            <ExhibitEnterCountBarChart exhibit_id={exhibitId} />
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default AnalyticsExhibit;
