import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth";
import userReducer from "./user";
import pageReducer from './page';
import placeReducer from './place';
import reservationReducer from './reservation';

const reducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    page: pageReducer,
    place: placeReducer,
    reservation: reservationReducer
});

const store = configureStore({ reducer });

export default store;

export type RootState = ReturnType<typeof store.getState>;