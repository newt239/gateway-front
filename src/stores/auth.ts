import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: ""
};

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, token) => {
            return Object.assign({}, state, { token: token });
        },
        clearToken: state => {
            return Object.assign({}, state, { token: "" });
        },
    }
});

export default slice.reducer;

export const { setToken, clearToken } = slice.actions;