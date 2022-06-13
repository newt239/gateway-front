import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentExhibitState, exhibitListState } from "#/recoil/exhibit";

import {
  FormControl,
  Select,
  SelectChangeEvent,
  MenuItem,
} from "@mui/material";

const SelectExhibit: React.FunctionComponent<{
  disabled?: boolean | false;
}> = ({ disabled }) => {
  const [currentExhibit, setCurrentExhibit] =
    useRecoilState(currentExhibitState);
  const exhibitList = useRecoilValue(exhibitListState);

  const handleChange = (event: SelectChangeEvent) => {
    const newCurrentExhibit = exhibitList.find((v) => {
      if (v.exhibit_id === event.target.value) {
        return v;
      }
    });
    if (newCurrentExhibit) {
      return setCurrentExhibit(newCurrentExhibit);
    }
    setCurrentExhibit({ exhibit_id: "", group_name: "", exhibit_type: "" });
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 200 }}>
      <Select
        disabled={disabled}
        size="small"
        value={currentExhibit.exhibit_id}
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
