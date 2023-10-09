import socketClient from 'socket.io-client';
import store from '../../store/index';
import { dashboardActions } from '../../store/dashboard-slice';

const SERVER = 'http://localhost:5000';
let socket;
const broadcastEventTypes = {
    ACTIVE_USERS: 'ACTIVE_USERS',
    GROUP_CALL_ROOMS: 'GROUP_CALL_ROOMS'
};

const broadcastEventsHandler = (data) => {
    if(data.event === broadcastEventTypes.ACTIVE_USERS) {
        store.dispatch(dashboardActions.setActiveUsers(data.activePeers));
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
};

export const registerNewUser = (username) => {
    socket.emit('register-new-user', {
        username: username,
        socketId: socket.id
    });
};