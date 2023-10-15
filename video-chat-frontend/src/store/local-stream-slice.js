import { createSlice } from '@reduxjs/toolkit';

// Store the different possible call states
export const callStates = {
    'Unvailable' : 0,
    'Available' : 1,
    'Requested' : 2,
    'InProgress' : 3
};

const localStreamSlice = createSlice({
    name : 'localStream',
    initialState: { 
        localStream : null, 
        callState : callStates.Unvailable,
        callingDialogVisible: false,
        callerUsername: ''
    },
    reducers: {
        setLocalStream(state, action) {
            state.localStream = action.payload
        },
        setCallState(state, action) {
            state.callState = action.payload;
        },
        setCallingDialogVisible(state, action) {
            state.callingDialogVisible = action.payload;
        },
        setCallerUsername(state, action) {
            state.callerUsername = action.payload;
        }
    }    
});

export const localSteamActions = localStreamSlice.actions;
export default localStreamSlice.reducer;