import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    current: 0,
    list: [{ place_id: "g2itc", place_name: "情報技術同好会" }, { place_id: "h1104", place_name: "高校1年4組" }]
};

const slice = createSlice({
    name: "place",
    initialState,
    reducers: {
        updateCurrentPlace: (state, action) => {
            console.log(action.payload)
            return Object.assign({}, state, { current: action.payload });
        },
    }
});

export default slice.reducer;

export const { updateCurrentPlace } = slice.actions;