import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import reservationReducer from '#/stores/reservation';

const reducer = combineReducers({
    reservation: reservationReducer
});

const store = configureStore({ reducer });

export default store;

export type RootState = ReturnType<typeof store.getState>;