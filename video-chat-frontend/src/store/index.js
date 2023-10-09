import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./dashboard-slice";

const store = configureStore({
        reducer: {
            myDashboard : dashboardReducer
        },
        devTools: process.env.NODE_ENV !== 'production', // Enable DevTools in non-production environment
    }
);

export default store;