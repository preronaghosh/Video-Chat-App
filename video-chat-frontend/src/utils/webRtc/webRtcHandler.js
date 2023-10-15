import store from "../../store/index";
import { localSteamActions } from "../../store/local-stream-slice";

const defaultConstraints = {
    video: true,
    audio: true
};

export const getLocalStream = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(defaultConstraints); // this returns a promise and that resolves to a MediaStream object
        store.dispatch(localSteamActions.setLocalStream(stream));
    } catch (error) {
        console.log("Error occurred while trying to get access to localstream");
        console.log(error);
    }
};