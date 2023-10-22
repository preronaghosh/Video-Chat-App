import { createSlice } from '@reduxjs/toolkit';

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState : { 
        username : '', 
        activeUsers: [],
        activeRooms: [] 
    },
    reducers : {
        setUsername(state, action) {
            state.username = action.payload;
        },
        setActiveUsers(state, action) {
            state.activeUsers = action.payload;
        },
        setActiveRooms(state, action) {
            state.activeRooms = action.payload;
        }
    }
});

export const dashboardActions = dashboardSlice.actions;
export default dashboardSlice.reducer;