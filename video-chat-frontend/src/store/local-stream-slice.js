import { createSlice } from '@reduxjs/toolkit';

const localStreamSlice = createSlice({
    name : 'localStream',
    initialState: { localStream : null },
    reducers: {
        setLocalStream(state, action) {
            state.localStream = action.payload
        }
    }    
});

export const localSteamActions = localStreamSlice.actions;
export default localStreamSlice.reducer;