import { createSlice } from "@reduxjs/toolkit";

type exhibitProp = {
    current: number;
    list: {
        exhibit_id: string;
        exhibit_name: string;
    }[]
}
const initialState: exhibitProp = {
    current: 0,
    list: []
};

const slice = createSlice({
    name: "exhibit",
    initialState,
    reducers: {
        setExhibitList: (state, action) => {
            return Object.assign({}, state, { list: action.payload });
        },
        updateCurrentExhibit: (state, action) => {
            return Object.assign({}, state, { current: action.payload });
        },
    }
});

export default slice.reducer;

export const { setExhibitList, updateCurrentExhibit } = slice.actions;