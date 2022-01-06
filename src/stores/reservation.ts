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
    reservation_id: "",
    guest_type: "",
    part: "",
    available: 0,
    count: 0,
    note: ""
};

const slice = createSlice({
    name: "reservation",
    initialState,
    reducers: {
        setReservationInfo: (state, action) => {
            return Object.assign({}, state, action.payload);
        },
        resetReservationInfo: state => {
            return initialState;
        }
    }
});

export default slice.reducer;

export const { setReservationInfo, resetReservationInfo } = slice.actions;