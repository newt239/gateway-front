import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import exhibitReducer from '#/stores/exhibit';
import reservationReducer from '#/stores/reservation';

const reducer = combineReducers({
    exhibit: exhibitReducer,
    reservation: reservationReducer
});

const store = configureStore({ reducer });

export default store;

export type RootState = ReturnType<typeof store.getState>;