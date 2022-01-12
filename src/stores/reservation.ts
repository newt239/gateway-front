import { createSlice } from "@reduxjs/toolkit";

type reservationInfoProp = {
    reservation_id: string;
    guest_type: string;
    part: string;
    available: 0 | 1;
    count: number;
    note: string;
};

const initialState: reservationInfoProp = {
    reservation_id: "R072648",
    guest_type: "general",
    part: "0",
    available: 1,
    count: 2,
    note: ""
};

const slice = createSlice({
    name: "reservation",
    initialState,
    reducers: {
        setReservationInfo: (state, action) => {
            return action.payload;
        },
        resetReservationInfo: state => {
            return initialState;
        }
    }
});

export default slice.reducer;

export const { setReservationInfo, resetReservationInfo } = slice.actions;