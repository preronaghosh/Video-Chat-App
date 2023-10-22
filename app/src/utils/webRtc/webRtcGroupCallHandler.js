import store from '../../store/index';
import { callStates, localStreamActions } from '../../store/local-stream-slice';
import { registerGroupCall, joinAnotherGroupCall } from '../wssConnection/wssConnection';

// Variables to store peers in a group call related data 
let myPeer;
let myPeerId;

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

        call.on('stream', (incomingStream) => {
            check_addVideoStream(incomingStream);
        });
    });
};

export const createNewGroupCall = () => {
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
    const call = myPeer.call(data.joineePeerId, localStream);

    call.on('stream', (incomingStream) => {
        check_addVideoStream(incomingStream);
    });
};

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