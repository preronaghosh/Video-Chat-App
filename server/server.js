const express = require("express");
const socket = require("socket.io");

const PORT = 5000;
const app = express();

let peers = [];
const broadcastEventTypes = {
    ACTIVE_USERS: 'ACTIVE_USERS',
    GROUP_CALL_ROOMS: 'GROUP_CALL_ROOMS'
};

const server = app.listen(PORT, () => {
    console.log("Server is listening on port 5000");
});

const io = socket(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    socket.emit('connection', null);
    console.log(`new user connected on ${socket.id}`);

    socket.on('register-new-user', (data) => {
        peers.push({
            username: data.username,
            socketId: data.socketId 
        });
        console.log("registered new user on server");
        console.log(peers);

        // Let all active users know about the newly registered active user
        io.sockets.emit('broadcast', {
            event: broadcastEventTypes.ACTIVE_USERS,
            activePeers: peers
        });
    });

    socket.on('disconnect', () => {
        console.log(`User with id: ${socket.id} disconnected`);
        // Remove the disconnected user from active peers list and update redux store state
        peers = peers.filter(user => user.socketId !== socket.id);
        console.log(peers);
        // Inform all other users of this change (re-render list of active participants on the dashboard)
        io.sockets.emit('broadcast', {
            event: broadcastEventTypes.ACTIVE_USERS,
            activePeers: peers
        });
    });

    // Listener for pre-offer request from callee towards caller
    socket.on('pre-offer', (data) => {
        console.log('pre-offer request sent from server to callee');
        
        // Send caller details for pre-offer request to Callee
        io.to(data.callee.socketId).emit('pre-offer', {
            callerUsername: data.caller.username,
            callerSocketId: socket.id
        });
    });

    // Server receives pre-offer answer from Callee and then has to send that to the Caller
    socket.on('pre-offer-answer', (data) => {

        // Server gets { 'callerSocketId', 'answer' } as part of data from Callee
        io.to(data.callerSocketId).emit('pre-offer-answer', {
            answer: data.answer
        });
    });

    // Listener for webRtc offer 
    socket.on('webRtc-offer', (data) => {
        // data format here: { calleeSocketId, offer }
        console.log("handling webrtc offer");

        // send offer to callee who accepted the pre-offer
        io.to(data.calleeSocketId).emit('webRtc-offer', {
            offer: data.offer
        });

    });

    socket.on('webRtc-answer', (data) => {
        // data format here: { callerSocketId, answer }

        io.to(data.callerSocketId).emit('webRtc-answer', {
            answer: data.answer
        });
    });

    // Server receives ICE candidate from Remote peer
    socket.on('webRtc-candidate', (data) => {
        io.to(data.connectedUserSocketId).emit('webRtc-candidate', {
            candidate : data.candidate
        });
    });
});