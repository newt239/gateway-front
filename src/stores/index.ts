import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import pageReducer from '#/stores/page';
import exhibitReducer from '#/stores/exhibit';
import reservationReducer from '#/stores/reservation';
import scanReducer from '#/stores/scan';

const reducer = combineReducers({
    page: pageReducer,
    exhibit: exhibitReducer,
    reservation: reservationReducer,
    scan: scanReducer
});

const store = configureStore({ reducer });

export default store;

export type RootState = ReturnType<typeof store.getState>;