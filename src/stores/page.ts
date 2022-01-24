import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    title: "ホーム"
};

const slice = createSlice({
    name: "page",
    initialState,
    reducers: {
        setPageInfo: (state, action) => {
            document.title = `${action.payload.title} | Gateway`;
            return Object.assign({}, state, action.payload);
        },
    }
});

export default slice.reducer;

export const { setPageInfo } = slice.actions;