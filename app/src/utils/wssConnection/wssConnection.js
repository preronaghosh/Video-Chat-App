import socketClient from 'socket.io-client';
import store from '../../store/index';
import { dashboardActions } from '../../store/dashboard-slice';
import { handleIncomingPreOffer, handleIncomingPreOfferAnswer, handleIncomingWebRtcOffer, handleIncomingAnswer, handleIncomingIceCandidate, handleUserHangUpRequest } from '../webRtc/webRtcHandler';
import { connectToANewUser, removeInactiveStream, checkIfRoomIsActive, clearGroupCallData } from '../webRtc/webRtcGroupCallHandler';

const SERVER = 'http://localhost:5000';
let socket;
const broadcastEventTypes = {
    ACTIVE_USERS: 'ACTIVE_USERS',
    GROUP_CALL_ROOMS: 'GROUP_CALL_ROOMS'
};


const broadcastEventsHandler = (data) => {
    if(data.event === broadcastEventTypes.ACTIVE_USERS) {
        // Add/Remove new peer for rendering a list other than the current user
        const newActiveUsers = data.activePeers.filter(peer => peer.socketId !== socket.id);
        store.dispatch(dashboardActions.setActiveUsers(newActiveUsers));
    } 

    if (data.event === broadcastEventTypes.GROUP_CALL_ROOMS) {
        // handles new group call, joining an existing group call or the host closing a group call room events
        // for room that was already closed by host, the room id will not be available in data.activeGroupCallRooms

        const groupCallRooms = data.activeGroupCallRooms.filter(room => room.socketId !== socket.id); // get rooms not created by current user
        const activeRoomId = checkIfRoomIsActive();

        if (activeRoomId) { // I am in an active group call right now

            // check if the active room is the one that was closed by host while emitting this event
            const room = groupCallRooms.find(room => room.roomId === activeRoomId); 

            // if my room is still active, then that was not closed by host
            // if room was not found, then host closed it - reset all data
            if (!room) {
                clearGroupCallData();
            }
        }
        // else, I am not in an active group call right now

        store.dispatch(dashboardActions.setActiveRooms(groupCallRooms));   // now we cannot see our created room in the bottom list
    }
} 

export const connectWithWebSocket = () => {
    socket = socketClient(SERVER);
    socket.on('connect', () => {
        console.log('Successfully connected with server');
        console.log(socket.id);
    });

    socket.on('broadcast', (data) => {
        broadcastEventsHandler(data);
    });

    // Event listener for incoming call (pre-offer stage) request
    socket.on('pre-offer', (data) => {
        handleIncomingPreOffer(data);
    });

    socket.on('pre-offer-answer', (data) => {
        handleIncomingPreOfferAnswer(data);
    });

    // listener for actual webrtc offer
    socket.on('webRtc-offer', (data) => {
        handleIncomingWebRtcOffer(data);
    });

    socket.on('webRtc-answer', (data) => {
        handleIncomingAnswer(data);
    });

    // User receives the ICE candidate
    socket.on('webRtc-candidate', (data) => {
        handleIncomingIceCandidate(data);
    });

    // We have received a hang up request 
    // no data is sent from server
    socket.on('hang-up', () => {
        handleUserHangUpRequest();
    });

    // Listeners related to group calls
    socket.on('join-group-call-request', (data) => {
        // data format: { joineePeerId, hostSocketId, localStreamId }
        connectToANewUser(data);
    });

    socket.on('group-call-user-left', (data) => {
        removeInactiveStream(data);
    });
};

export const registerNewUser = (username) => {
    socket.emit('register-new-user', {
        username: username,
        socketId: socket.id
    });
};

// Current user emits pre-offer request to another user (server)
export const sendPreOffer = (data) => {
    socket.emit('pre-offer', data);
};

export const sendPreOfferAnswer = (data) => {
    socket.emit('pre-offer-answer', data);
};

// when caller wants to send callee the actual webRtc offer
export const sendWebRtcOffer = (data) => {
    socket.emit('webRtc-offer', data);
};

// When callee accepts the webRtc offer
export const sendWebRtcAnswer = (data) => {
    socket.emit('webRtc-answer', data);
};

// Send caller's ICE candidate to Callee
export const sendIceCandidateToRemotePeer = (data) => {
    socket.emit('webRtc-candidate', data);
};

// Send hang up request to connected user
export const sendUserHangUpSignal = (data) => {
    socket.emit('hang-up', data);
};

// Emitting events related to Group Calls

export const registerGroupCall = (data) => {
    // format of data: {username, peerId}
    socket.emit('group-call-register', data);
};

export const joinAnotherGroupCall = (data) => {
    //format of data: { myPeerId, hostSocketId, roomId, localStreamId }
    socket.emit('join-group-call-request', data);
};

export const userLeftGroupCall = (data) => {
    // data format: { streamId, roomId }
    socket.emit('group-call-user-left', data);
};

export const groupCallClosedByHost = (data) => {
    // data : { peerId }
    socket.emit('group-call-closed-by-host', data);
};