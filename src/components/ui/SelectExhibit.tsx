import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../stores/index';
import { updateCurrentExhibit } from '../../stores/exhibit';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


const SelectExhibit = () => {
    const dispatch = useDispatch();
    const exhibit = useSelector((state: RootState) => state.exhibit);
    const handleChange = (event: SelectChangeEvent) => {
        dispatch(updateCurrentExhibit(event.target.value));
    };
    return (
        <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Select
                value={String(exhibit.current)}
                onChange={handleChange}
            >
                {exhibit.list.map((eachItem, index) => <MenuItem value={index} key={eachItem.exhibit_id}>{eachItem.exhibit_name}</MenuItem>)}
            </Select>
        </FormControl>
    )
}

export default SelectExhibit;