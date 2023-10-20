import store from "../../store/index";
import { localStreamActions, callStates } from "../../store/local-stream-slice";
import { sendPreOffer, sendPreOfferAnswer, sendWebRtcOffer, sendWebRtcAnswer, sendIceCandidateToRemotePeer } from "../wssConnection/wssConnection";

let connectedUserSocketId; // Stores currently connected user on a direct call
let peerConnection; 

const defaultConstraints = {   // Stores the default mediaStream object config
    video: true,
    audio: true
};

const peerConnectionConfig = {
    iceServers: [{ 
        urls: 'stun:stun.l.google.com:13902'
    }]
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

        createPeerConnection();
        
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

// Methods for handling pre-offer requests and responses
export const handleIncomingPreOffer = (data) => {   // Method to handle when another user is sending a pre-offer request to current user
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

export const handleIncomingPreOfferAnswer = (data) => {
    // data recieved here is { answer }
    
    // Hide the calling dialog box first
    store.dispatch(localStreamActions.setCallingDialogVisible(false));

    let rejectionReason;
    if (data.answer === preOfferAnswers.Accepted) {
        
        // proceed with sending actual webRTC offer
        sendOffer();

    } else {
        if (data.answer === preOfferAnswers.NotAvailable) {
            rejectionReason = "User unavailable to pick up calls right now!";
        } else {
            rejectionReason = "User rejected the call!";
        }
        store.dispatch(localStreamActions.setCallRejectionDetails({
            rejected: true,
            reason: rejectionReason
        }));
        resetCallData();
    }
};

// Called from react component that monitors the Accept button state
export const acceptIncomingCallRequest = () => {
    sendPreOfferAnswer({
        callerSocketId: connectedUserSocketId, 
        answer: preOfferAnswers.Accepted
    });

    store.dispatch(localStreamActions.setCallState(callStates.InProgress));
}; 

// Called from react component that monitors the Reject button state
export const rejectIncomingCallRequest = () => {
    sendPreOfferAnswer({
        callerSocketId: connectedUserSocketId,
        answer: preOfferAnswers.Rejected
    });

    resetCallData();
}; 

// Peer Connection related methods
const createPeerConnection = () => {
    peerConnection = new RTCPeerConnection(peerConnectionConfig);
    
    const localStream = store.getState().callLocalStream.localStream;
    
    // mediaStream objects have multiple tracks associated with it that make up the complete stream (namely, audio & video tracks)
    for (const track of localStream.getTracks()) {
        peerConnection.addTrack(track, localStream);
    }

    // When we receive a stream with tracks from a remote peer
    peerConnection.ontrack = (event) => {
        const remoteStream = event.streams[0]; 
        const remoteTrack = event.track; 
        // add stream to redux store  
        store.dispatch(localStreamActions.setRemoteStream(remoteStream));
    };

    peerConnection.onicecandidate = (event) => {
        // send our ice candidates to other connected users
        if (event.candidate) {
            sendIceCandidateToRemotePeer({
                candidate: event.candidate,
                connectedUserSocketId: connectedUserSocketId
            });
        }
    };

    // when ICE candidates have been updated
    peerConnection.onconnectionstatechange = (event) => {
        if (peerConnection.connectionState === 'connected') {
            console.log("Connection successfully established with remote peer");
        }
    };
};

const sendOffer = async () => {
    const offer = await peerConnection.createOffer();
    // console.log(offer); // debug
    await peerConnection.setLocalDescription(offer);

    console.log(`CalleeSocketId at frontend is: ${connectedUserSocketId}`);
    sendWebRtcOffer({
        calleeSocketId: connectedUserSocketId,
        offer: offer
    });
};  

// Handles incoming actual webRtc offer 
export const handleIncomingWebRtcOffer = async (data) => {
    await peerConnection.setRemoteDescription(data.offer);

    // Callee creates an answer and sets its local description
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    // Need to send the answer to the caller
    sendWebRtcAnswer({
        callerSocketId: connectedUserSocketId,
        answer: answer
    });
}; 

export const handleIncomingAnswer = async (data) => {
    try {
        await peerConnection.setRemoteDescription(data.answer);
    }
    catch (error) {
        console.log("Error setting remote description");
    }
};

export const handleIncomingIceCandidate = async (data) => {
    try {
        console.log("Adding ICE candidates");
        await peerConnection.addIceCandidate(data.candidate);
    } catch (error) {
        console.error('Error occured during reception of ICE candidate from remote peer', error);
    }
};

// Screen Sharing Stream Implementation
let screenShareStream;

export const switchToScreenSharing = async () => {
    if (!store.getState().callLocalStream.localScreenShareEnabled) {
        try {
            screenShareStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            store.dispatch(localStreamActions.setLocalScreenShareEnabled(true));
    
            // get all senders sending a video track
            const senders = peerConnection.getSenders(); 
            const sender = senders.find(sender => sender.track.kind === screenShareStream.getVideoTracks()[0].kind);
            sender.replaceTrack(screenShareStream.getVideoTracks()[0]);

        } catch (error) {
            console.log("Error occured while trying to set screen sharing!", error);
        }
    }
    else {
        const localStream = store.getState().callLocalStream.localStream;

        const senders = peerConnection.getSenders(); 
        const sender = senders.find(sender => sender.track.kind === localStream.getVideoTracks()[0].kind);
        sender.replaceTrack(localStream.getVideoTracks()[0]);
        store.dispatch(localStreamActions.setLocalScreenShareEnabled(false));

        screenShareStream.getTracks().forEach(track => track.stop());
    }
};