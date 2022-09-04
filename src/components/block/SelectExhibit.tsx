import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useAtomValue } from "jotai";
import { tokenAtom, profileAtom } from "#/components/lib/jotai";
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

import { ExhibitProps } from "#/components/lib/types";
import { handleApiError } from "#/components/lib/commonFunction";

type SelectExhibitProps = {
  currentExhibit: string;
  setCurrentExhibit: Dispatch<SetStateAction<string>>;
};

const SelectExhibit: React.VFC<SelectExhibitProps> = ({
  currentExhibit,
  setCurrentExhibit,
}) => {
  const token = useAtomValue(tokenAtom);
  const profile = useAtomValue(profileAtom);
  const [loading, setLoading] = useState(true);
  const [exhibitList, setExhibitList] = useState<ExhibitProps[]>([]);

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
          const newExhibitList = [];
          if (profile.user_type === "executive") {
            newExhibitList.push(...res.filter(
              (v) => v.exhibit_type === "stage" || v.exhibit_type === "other"
            ));
          } else {
            newExhibitList.push(...res);
          }
          setExhibitList(newExhibitList);
          if (currentExhibit === "" || newExhibitList.filter(exhibit => exhibit.exhibit_id === currentExhibit).length === 0) {
            setCurrentExhibit(newExhibitList[0].exhibit_id);
          }
          ReactGA.event({
            category: "exhibit",
            action: "exhibit_list_request",
            label: profile.user_id,
          });
        })
        .catch((err: AxiosError) => {
          handleApiError(err, "exhibit_list_get");
        })
        .finally(() => {
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
    <Grid container spacing={2} sx={{ alignItems: "center" }}>
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
