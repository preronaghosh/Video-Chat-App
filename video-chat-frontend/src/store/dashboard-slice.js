import { createSlice } from '@reduxjs/toolkit';

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState : { username : '', activeUsers: [] },
    reducers : {
        setUsername(state, action) {
            state.username = action.payload;
        },
        setActiveUsers(state, action) {
            state.activeUsers = action.payload;
        }
    }
});

export const dashboardActions = dashboardSlice.actions;
export default dashboardSlice.reducer;