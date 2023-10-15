import store from "../../store/index";
import { localStreamActions, callStates } from "../../store/local-stream-slice";
import { sendPreOffer, sendPreOfferAnswer } from "../wssConnection/wssConnection";

let connectedUserSocketId; // Stores currently connected user on a direct call

const defaultConstraints = {   // Stores the default mediaStream object config
    video: true,
    audio: true
};

const preOfferAnswers = {
    'Rejected' : 0,
    'Accepted' : 1,
    'NotAvailable' : 2
};

// Helper function to check if anyone can call the current user or not
export const isCallPossible = () => {
    if (store.getState().callLocalStream.localStream === null || store.getState().callLocalStream.callState !== callStates.Available) {
        return false;
    }
    return true;
};

// Helper function to reset store state and global variables when a call has been rejected by current user
export const resetCallData = () => {
    connectedUserSocketId = null; 
    store.dispatch(localStreamActions.setCallState(callStates.Available));
};


export const getLocalStream = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(defaultConstraints); // this returns a promise and that resolves to a MediaStream object
        store.dispatch(localStreamActions.setLocalStream(stream));

        // After receiving the localStream successfully, we can update the call state
        store.dispatch(localStreamActions.setCallState(callStates.Available));
        
    } catch (error) {
        console.log("Error occurred while trying to get access to localstream");
        console.log(error);
    }
};


// Current user tries to call another active user
export const callAnotherUser = (calleeDetails) => {
    connectedUserSocketId = calleeDetails.socketId;
    // Set call state as in_progress, calling dialog should be visible to current user
    store.dispatch(localStreamActions.setCallState(callStates.InProgress));
    store.dispatch(localStreamActions.setCallingDialogVisible(true));

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

    if (isCallPossible()) {
        connectedUserSocketId = data.callerSocketId;
        store.dispatch(localStreamActions.setCallState(callStates.Requested));
        store.dispatch(localStreamActions.setCallerUsername(data.callerUsername));

    } else {
        // send rejected pre-offer answer
        sendPreOfferAnswer({
            callerSocketId: data.callerSocketId, 
            answer: preOfferAnswers.NotAvailable
        });

    }
};

export const acceptIncomingCallRequest = () => {
    sendPreOfferAnswer({
        callerSocketId: connectedUserSocketId, 
        answer: preOfferAnswers.Accepted
    });
}; 

export const rejectIncomingCallRequest = () => {
    sendPreOfferAnswer({
        callerSocketId: connectedUserSocketId,
        answer: preOfferAnswers.Rejected
    });

    resetCallData();
}; 

export const handleIncomingPreOfferAnswer = (data) => {
    // data recieved here is { answer }
    
    // Hide the calling dialog box first
    store.dispatch(localStreamActions.setCallingDialogVisible(false));

    let rejectionReason;
    if (data.answer === preOfferAnswers.Accepted) {
        
        // proceed with sending actual webRTC offer

    } else if (data.answer === preOfferAnswers.Rejected) {

        rejectionReason = "User rejected the call";

    } else {
        
        rejectionReason = "User unavailable to pick up the call";
    }

    // Update the state in store so that the rejection reason can be displayed to the user
    store.dispatch(localStreamActions.setCallRejectionDetails({
        rejected: true,
        reason: rejectionReason
    }));
};