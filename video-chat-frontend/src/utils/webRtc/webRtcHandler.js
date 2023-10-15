import store from "../../store/index";
import { localSteamActions, callStates } from "../../store/local-stream-slice";
import { sendPreOffer } from "../wssConnection/wssConnection";

// Stores the default mediaStream object config
const defaultConstraints = {
    video: true,
    audio: true
};

// Stores currently connected user on a direct call
let connectedUserSocketId;


export const getLocalStream = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(defaultConstraints); // this returns a promise and that resolves to a MediaStream object
        store.dispatch(localSteamActions.setLocalStream(stream));

        // After receiving the localStream successfully, we can update the call state
        store.dispatch(localSteamActions.setCallState(callStates.Available));
        
    } catch (error) {
        console.log("Error occurred while trying to get access to localstream");
        console.log(error);
    }
};


// Current user tries to call another active user
export const callAnotherUser = (calleeDetails) => {
    connectedUserSocketId = calleeDetails.socketId;
    // Set call state as in_progress, calling dialog should be visible to current user
    store.dispatch(localSteamActions.setCallState(callStates.InProgress));
    store.dispatch(localSteamActions.setCallingDialogVisible(true));

    // Send all pre-offer details to the user that you want to call
    sendPreOffer({
        callee: calleeDetails,
        caller: {
            username: store.getState().myDashboard.username
        }
    });
}; 

// Method to handle when another user is sending a pre-offer request to current user
export const handleIncomingPreOffer = (data) => {
    connectedUserSocketId = data.callerSocketId;
    store.dispatch(localSteamActions.setCallState(callStates.Requested));
    store.dispatch(localSteamActions.setCallerUsername(data.callerUsername));
};