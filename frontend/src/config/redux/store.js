import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer/index";

export const store=configureStore({
    reducer:{
        auth:authReducer
    },

})