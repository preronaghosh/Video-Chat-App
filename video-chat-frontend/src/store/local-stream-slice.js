import { createSlice } from '@reduxjs/toolkit';

// Store the different possible call states
const callStates = {
    'Unvailable' : 0,
    'Available' : 1,
    'Requested' : 2,
    'InProgress' : 3
};

const localStreamSlice = createSlice({
    name : 'localStream',
    initialState: { localStream : null, callState : callStates.Unvailable },
    reducers: {
        setLocalStream(state, action) {
            state.localStream = action.payload
        },
        setCallState(state, action) {
            state.callState = action.payload;
        }
    }    
});

export const localSteamActions = localStreamSlice.actions;
export default localStreamSlice.reducer;