import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth";
import userReducer from "./user";

const reducer = combineReducers({
    auth: authReducer,
    user: userReducer
});

const store = configureStore({ reducer });

export default store;

export type RootState = ReturnType<typeof store.getState>;