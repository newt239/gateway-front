import { createSlice } from "@reduxjs/toolkit";

type exhibitProp = {
    current: {
        exhibit_id: string;
        exhibit_name: string;
    };
    list: {
        exhibit_id: string;
        exhibit_name: string;
    }[]
}
const initialState: exhibitProp = {
    current: {
        exhibit_id: "",
        exhibit_name: ""
    },
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
            console.log(action.payload)
            return Object.assign({}, state, { current: action.payload });
        },
    }
});

export default slice.reducer;

export const { setExhibitList, updateCurrentExhibit } = slice.actions;