import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";

import {
  FormControl,
  Select,
  SelectChangeEvent,
  MenuItem,
} from "@mui/material";
import { profileState, tokenState } from "#/recoil/user";
import { currentExhibitState } from "#/recoil/exhibit";

type exhibitProp = {
  exhibit_id: string;
  group_name: string;
  exhibit_type: string;
};

const SelectExhibit: React.FunctionComponent<{
  disabled?: boolean | false;
}> = ({ disabled }) => {
  const token = useRecoilValue(tokenState);
  const profile = useRecoilValue(profileState);
  const [exhibitList, setExhibitList] = useState<exhibitProp[]>([]);
  const [currentExhibit, setCurrentExhibit] =
    useRecoilState(currentExhibitState);

  useEffect(() => {
    if (token && profile) {
      apiClient(process.env.REACT_APP_API_BASE_URL)
        .exhibit.list.$get({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (profile.user_type === "executive") {
            setExhibitList(res.filter((v) => v.exhibit_type === "stage"));
          } else {
            setExhibitList(res);
          }
          setCurrentExhibit(res[0].exhibit_id);
        })
        .catch((err: AxiosError) => {
          console.log(err);
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
    <FormControl sx={{ m: 1, minWidth: 200 }}>
      <Select
        disabled={disabled}
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
  );
};

export default SelectExhibit;
