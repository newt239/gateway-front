import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../stores/index';
import { updateCurrentPlace } from '../../stores/place';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Grid, Paper, Box, Typography, Button } from '@mui/material';


const SelectPlace = () => {
    const dispatch = useDispatch();
    const place = useSelector((state: RootState) => state.place);
    const handleChange = (event: SelectChangeEvent) => {
        dispatch(updateCurrentPlace(event.target.value));
    };
    return (
        <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>施設</InputLabel>
            <Select
                value={String(place.current)}
                label="施設"
                onChange={handleChange}
            >
                {place.list.map((eachItem, index) => <MenuItem value={index} key={eachItem.place_id}>{eachItem.place_name}</MenuItem>)}
            </Select>
        </FormControl>
    )
}

export default SelectPlace;