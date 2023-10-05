import socketClient from 'socket.io-client';

const SERVER = 'http://localhost:5000';
let socket;

export const connectWithWebSocket = () => {
    socket = socketClient(SERVER);
    socket.on('connect', () => {
        console.log('Successfully connected');
        console.log(socket.id);
    });
};