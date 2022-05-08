import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentExhibitState, exhibitListState } from "#/recoil/exhibit";

import { Stack, FormControl, TextField, Autocomplete } from "@mui/material";

const SelectExhibit: React.FunctionComponent<{
  disabled?: boolean | false;
}> = ({ disabled }) => {
  const [currentExhibit, setCurrentExhibit] =
    useRecoilState(currentExhibitState);
  const exhibitList = useRecoilValue(exhibitListState);

  const handleChange = (
    event: React.SyntheticEvent,
    value: { exhibit_id: string; exhibit_name: string },
    reason: string
  ) => {
    if (reason === "clear") {
      setCurrentExhibit({ exhibit_id: "", exhibit_name: "" });
    } else {
      setCurrentExhibit(value);
    }
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 200 }}>
      <Stack spacing={2}>
        <Autocomplete
          disableClearable
          disabled={disabled}
          size="small"
          options={exhibitList}
          getOptionLabel={(option) => option.exhibit_name}
          value={currentExhibit}
          onChange={handleChange}
          renderInput={(params) => (
            <TextField {...params} label="展示名" placeholder="展示名" />
          )}
        />
      </Stack>
    </FormControl>
  );
};

export default SelectExhibit;
