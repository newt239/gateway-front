import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: ""
};

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action) => {
            return Object.assign({}, state, { token: action.payload });
        },
        clearToken: state => {
            return Object.assign({}, state, { token: "" });
        },
    }
});

export default slice.reducer;

export const { setToken, clearToken } = slice.actions;