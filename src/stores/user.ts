import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: '',
    info: {
        userid: '',
        display_name: '',
        user_type: '',
        role: '',
        available: false,
        note: '',
    }
};

const slice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setProfile: (state, action) => {
            return Object.assign({}, state, { info: action.payload });
        },
        setToken: (state, action) => {
            return Object.assign({}, state, { token: action.payload });
        },
        clearToken: state => {
            return Object.assign({}, state, { token: '' });
        }
    }
});

export default slice.reducer;

export const { setProfile, setToken, clearToken } = slice.actions;