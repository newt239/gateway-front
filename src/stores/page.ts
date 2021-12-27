import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    title: "ホーム"
};

const slice = createSlice({
    name: "page",
    initialState,
    reducers: {
        setTitle: (state, action) => {
            return Object.assign({}, state, { title: action.payload });
        },
    }
});

export default slice.reducer;

export const { setTitle } = slice.actions;