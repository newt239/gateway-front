import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import pageReducer from '#/stores/page';
import exhibitReducer from '#/stores/exhibit';
import reservationReducer from '#/stores/reservation';

const reducer = combineReducers({
    page: pageReducer,
    exhibit: exhibitReducer,
    reservation: reservationReducer
});

const store = configureStore({ reducer });

export default store;

export type RootState = ReturnType<typeof store.getState>;