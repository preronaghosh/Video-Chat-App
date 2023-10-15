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
});