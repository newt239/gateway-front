import { createSlice } from "@reduxjs/toolkit";

type reservationInfoProp = {
    reservation_id: string;
    guest_type: "general" | "student" | "special";
    part: string;
    available: 0 | 1;
    count: number;
    registed: number;
    note: string;
};

const initialState: reservationInfoProp = {
    reservation_id: "",
    guest_type: "general",
    part: "all",
    available: 0,
    count: 0,
    registed: 0,
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