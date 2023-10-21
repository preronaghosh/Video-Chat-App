import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./dashboard-slice";
import localStreamReducer from './local-stream-slice';

const store = configureStore({
        reducer: {
            myDashboard : dashboardReducer,
            callLocalStream: localStreamReducer
        },
        devTools: process.env.NODE_ENV !== 'production', // Enable DevTools in non-production environment
    }
);

export default store;