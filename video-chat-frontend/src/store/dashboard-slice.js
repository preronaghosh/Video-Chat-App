import { createSlice } from '@reduxjs/toolkit';

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState : { username : '' },
    reducers : {
        setUsername(state, action) {
            state.username = action.username;
        }
    }
});

export const dashboardActions = dashboardSlice.actions;
export default dashboardSlice.reducer;