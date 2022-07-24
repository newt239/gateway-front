import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import ReactGA from "react-ga4";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";

import {
  FormControl,
  Select,
  SelectChangeEvent,
  MenuItem,
  CircularProgress,
  Grid,
} from "@mui/material";
import { profileState, tokenState } from "#/recoil/user";
import { currentExhibitState } from "#/recoil/exhibit";

type exhibitProp = {
  exhibit_id: string;
  group_name: string;
  exhibit_type: string;
};

const SelectExhibit = () => {
  const token = useRecoilValue(tokenState);
  const profile = useRecoilValue(profileState);
  const [loading, setLoading] = useState(true);
  const [exhibitList, setExhibitList] = useState<exhibitProp[]>([]);
  const [currentExhibit, setCurrentExhibit] =
    useRecoilState(currentExhibitState);

  useEffect(() => {
    if (token && profile) {
      setLoading(true);
      apiClient(process.env.REACT_APP_API_BASE_URL)
        .exhibit.list.$get({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (profile.user_type === "executive") {
            const executiveExhibitList = res.filter(
              (v) => v.exhibit_type === "stage" || v.exhibit_type === "special"
            );
            setExhibitList(executiveExhibitList);
            setCurrentExhibit(executiveExhibitList[0].exhibit_id);
          } else {
            setExhibitList(res);
            setCurrentExhibit(res[0].exhibit_id);
          }
          ReactGA.event({
            category: "exhibit",
            action: "exhibit_list_request",
            label: profile.user_id,
          });
        })
        .catch((err: AxiosError) => {
          console.log(err);
        }).finally(() => {
          setLoading(false);
        });
    }
  }, [profile]);

  const handleChange = (event: SelectChangeEvent) => {
    const newCurrentExhibit = exhibitList.find((v) => {
      if (v.exhibit_id === event.target.value) {
        return v;
      }
    });
    if (newCurrentExhibit) {
      return setCurrentExhibit(newCurrentExhibit.exhibit_id);
    }
  };

  return (
    <Grid container sx={{ alignItems: "center", gap: ".5rem" }}>
      <Grid item>
        <FormControl sx={{ m: 1, minWidth: 200 }}>
          <Select
            disabled={loading}
            size="small"
            value={currentExhibit}
            onChange={handleChange}
          >
            {exhibitList.map((v) => {
              return (
                <MenuItem value={v.exhibit_id} key={v.exhibit_id}>
                  {v.group_name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>
      {loading && (
        <Grid item>
          <CircularProgress size={30} thickness={6} />
        </Grid>
      )}
    </Grid>
  );
};

export default SelectExhibit;
