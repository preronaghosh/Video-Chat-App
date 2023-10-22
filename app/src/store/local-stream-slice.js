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
        callerUsername: '',
        callRejectionDetails: {
            rejected: false,
            reason: ''
        },
        remoteStream : null,
        localCameraEnabled: true,
        localMicrophoneEnabled: true,
        localScreenShareEnabled: false,
        groupCallActive: false,
        groupCallStreams: [],
        chatMessage: {
            received: false,
            content: ''
        }
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
        },
        setCallRejectionDetails(state, action) {
            state.callRejectionDetails.rejected = action.payload.rejected;
            state.callRejectionDetails.reason = action.payload.reason;
        },
        setRemoteStream(state, action) {
            state.remoteStream = action.payload;
        },
        setLocalCameraEnabled(state, action) {
            state.localCameraEnabled = action.payload;
        },
        setLocalMicrophoneEnabled(state, action) {
            state.localMicrophoneEnabled = action.payload;
        },
        setLocalScreenShareEnabled(state, action) {
            state.localScreenShareEnabled = action.payload;
        },
        setGroupCallActive(state, action) {
            state.groupCallActive = action.payload;
        },
        setGroupCallStreams(state, action) {
            state.groupCallStreams = action.payload;
        },
        setChatMessage(state, action) {
            state.chatMessage.received = action.payload.received;
            state.chatMessage.content = action.payload.content;
        }
    }    
});

export const localStreamActions = localStreamSlice.actions;
export default localStreamSlice.reducer;