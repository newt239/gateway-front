import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: ''
};

const slice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setName: (state, action) => {
            return Object.assign({}, state, { name: action.payload })
        },
        clearName: state => {
            return Object.assign({}, state, { name: "" })
        },
    }
});

export default slice.reducer;

export const { setName, clearName } = slice.actions;