import store from "../../store/index";
import { localSteamActions } from "../../store/local-stream-slice";

const callStates = {
    'Unvailable' : 0,
    'Available' : 1,
    'Requested' : 2,
    'InProgress' : 3
};

const defaultConstraints = {
    video: true,
    audio: true
};

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