import { configureStore } from "@reduxjs/toolkit";
import dashboardSlice  from "./dashboard-slice";
import { dashboardActions } from "./dashboard-slice";

const store = configureStore({
        reducer: {
            myDashboard : dashboardSlice
        }
    }
);

export default store;