import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth";
import userReducer from "./user";
import pageReducer from './page';
import exhibitReducer from './exhibit';
import reservationReducer from './reservation';
import scanReducer from './scan';

const reducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    page: pageReducer,
    exhibit: exhibitReducer,
    reservation: reservationReducer,
    scan: scanReducer
});

const store = configureStore({ reducer });

export default store;

export type RootState = ReturnType<typeof store.getState>;