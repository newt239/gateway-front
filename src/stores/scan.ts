import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    state: false, deviceId: { deviceId: "", label: "" }, deviceList: []
};

const slice = createSlice({
    name: "scan",
    initialState,
    reducers: {
        useQrReader: (state, action) => {
            return Object.assign({}, state, { state: action.payload });
        },
        setDeviceList: (state, action) => {
            return Object.assign({}, state, { deviceList: action.payload })
        },
        setCurrentDevice: (state, action) => {
            return Object.assign({}, state, { deviceId: action.payload })
        }
    }
});

export default slice.reducer;

export const { useQrReader, setDeviceList, setCurrentDevice } = slice.actions;