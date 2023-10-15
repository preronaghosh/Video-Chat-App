import socketClient from 'socket.io-client';
import store from '../../store/index';
import { dashboardActions } from '../../store/dashboard-slice';
import { handleIncomingPreOffer, handleIncomingPreOfferAnswer } from '../webRtc/webRtcHandler';

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