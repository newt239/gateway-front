import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userid: '',
    display_name: '',
    user_type: '',
    role: '',
    available: '',
    note: '',
};

const slice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setProfile: (state, action) => {
            console.log(action.payload)
            return Object.assign({}, state, action.payload);
        },
    }
});

export default slice.reducer;

export const { setProfile } = slice.actions;