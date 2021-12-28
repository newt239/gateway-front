import { createSlice } from "@reduxjs/toolkit";

const initialState = { state: false };

const slice = createSlice({
    name: "scan",
    initialState,
    reducers: {
        pauseQrReader: (state, action) => {
            return Object.assign({}, state, action.payload);
        },
    }
});

export default slice.reducer;

export const { pauseQrReader } = slice.actions;