import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../stores/index';
import { updateCurrentExhibit } from '../../stores/exhibit';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from "@mui/material";

const SelectExhibit: React.FunctionComponent<{ disabled?: boolean | false }> = ({ disabled }) => {
    const dispatch = useDispatch();
    const exhibit = useSelector((state: RootState) => state.exhibit);
    const handleChange = (event: React.SyntheticEvent, value: any, reason: string) => {
        if (reason === "clear") {
            dispatch(updateCurrentExhibit({ exhibit_id: "", exhibit_name: "" }));
        } else {
            dispatch(updateCurrentExhibit(value));
        };
    };
    return (
        <FormControl sx={{ m: 1, minWidth: 200 }}>
            <Stack spacing={2}>
                <Autocomplete
                    disableClearable
                    disabled={disabled}
                    size="small"
                    options={exhibit.list}
                    getOptionLabel={(option) => option.exhibit_name}
                    value={exhibit.current}
                    onChange={handleChange}
                    renderInput={(params) => (
                        <TextField {...params} label="展示名" placeholder="展示名" />
                    )}
                />
            </Stack>
        </FormControl>
    )
}

export default SelectExhibit;