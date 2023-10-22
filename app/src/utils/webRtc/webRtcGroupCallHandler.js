import store from '../../store/index';
import { callStates, localStreamActions } from '../../store/local-stream-slice';
import { registerGroupCall, joinAnotherGroupCall, userLeftGroupCall, groupCallClosedByHost } from '../wssConnection/wssConnection';

// Variables to store peers in a group call related data 
let myPeer;
let myPeerId;
let activeGroupCallId;
let isGroupCallOwner = false; // flag is true when current host is the room creator

export const connectWithMyPeer = () => {
    myPeer = new window.Peer(undefined, {
        path: '/peerjs',
        host: '/',
        port: '5000'
    }); // setting undefined creates default IDs, else we can specify

    myPeer.on('open', (id) => {
        console.log(`Successfully connected with peer server id: ${id}`);
        myPeerId = id;
        console.log(`my peerId: ${myPeerId}`);
    });

    // listeners for another user trying to send stream to join a call
    // this is executed when connectToANewUser gets called 
    myPeer.on('call', call => {
        //send our stream to the new user
        call.answer(store.getState().callLocalStream.localStream);

        // event listener to receive a remote stream for group call
        call.on('stream', (incomingStream) => {
            check_addVideoStream(incomingStream);
        });
    });
};

export const createNewGroupCall = () => {
    isGroupCallOwner = true;

    registerGroupCall({
        username: store.getState().myDashboard.username,
        peerId: myPeerId
    });

    store.dispatch(localStreamActions.setGroupCallActive(true)); // we want to instantly join the group call room we just created
    store.dispatch(localStreamActions.setCallState(callStates.InProgress));
};

// Current user wants to join a group call
export const joinGroupCall = (hostSocketId, roomId) => {
    const localStream = store.getState().callLocalStream.localStream;
    activeGroupCallId = roomId;

    joinAnotherGroupCall({
        peerId: myPeerId,
        hostSocketId, 
        roomId,
        localStreamId: localStream.id 
    });

    store.dispatch(localStreamActions.setGroupCallActive(true)); 
    store.dispatch(localStreamActions.setCallState(callStates.InProgress));
};

// when connecting a new user who is trying to join to my room
export const connectToANewUser = (data) => {
    // format here: { joineePeerId, hostSocketId, localStreamId }
    const localStream = store.getState().callLocalStream.localStream;
    const call = myPeer.call(data.joineePeerId, localStream); // call another peer and send localStream

    // when the other peer answers, current user will receive a stream
    call.on('stream', (incomingStream) => {
        check_addVideoStream(incomingStream);
    });
};

export const exitGroupCall = () => {
    // Check first if the group call is being closed by the host/another participant

    if (isGroupCallOwner) {                 // if host closes the group
        groupCallClosedByHost({
            peerId: myPeerId
        });    
    } else {                                // if participant is leaving a group call
        userLeftGroupCall({
            streamId: store.getState().callLocalStream.localStream.id,
            roomId: activeGroupCallId
        });
    }
    clearGroupCallData();
};

export const clearGroupCallData = () => {
    activeGroupCallId = null;
    isGroupCallOwner = null;
    store.dispatch(localStreamActions.setGroupCallActive(false));
    store.dispatch(localStreamActions.setCallState(callStates.Available));
    store.dispatch(localStreamActions.setGroupCallStreams([]));

    // Destroy current group call and create a new peer connection for next call
    myPeer.destroy();
    connectWithMyPeer();
};

// When users in a group call get to know that a user has left, they remove the inactive stream 
export const removeInactiveStream = (data) => {
    // get only the active streams list
    const updatedGroupCallStreams = store.getState().callLocalStream.groupCallStreams.filter(stream => stream.id !== data.streamId);
    store.dispatch(localStreamActions.setGroupCallStreams(updatedGroupCallStreams));
};

// helper function for checking incoming stream and adding to global variable
const check_addVideoStream = (incomingStream) => {
    const currentStoredStreams = store.getState().callLocalStream.groupCallStreams;
    // check if incoming stream is already stored or not
    const hasStream = currentStoredStreams.find(stream => stream.id === incomingStream.id);
    
    if (!hasStream) {
        const updatedGroupCallStreams = [
            ...store.getState().callLocalStream.groupCallStreams,
            incomingStream
        ];
        store.dispatch(localStreamActions.setGroupCallStreams(updatedGroupCallStreams));
    }
};

// return room id if room has not been closed by host
// else return false
export const checkIfRoomIsActive = () => {
    
    if (store.getState().callLocalStream.groupCallActive) {
        return activeGroupCallId;
    }

    return false;
};