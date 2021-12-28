import { createSlice } from "@reduxjs/toolkit";

const initialState = { reservation_id: "", available: false, guest_type: "", part: "", count: 0 };

const slice = createSlice({
    name: "reservation",
    initialState,
    reducers: {
        updateReservationInfo: (state, action) => {
            return Object.assign({}, state, action.payload);
        },
    }
});

export default slice.reducer;

export const { updateReservationInfo } = slice.actions;