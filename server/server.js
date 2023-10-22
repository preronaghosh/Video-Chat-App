const express = require("express");
const socket = require("socket.io"); // for direct calls 
const { ExpressPeerServer } = require("peer"); // for sending group call offers and answers
const groupCallServer = require('./group-call-server');
const { v4: uuidv4 } = require('uuid');

const PORT = 5000;
const app = express();

let peers = []; // maintain a list of active peers
let groupCallRooms = []; // maintain a list of active rooms

const broadcastEventTypes = {
    ACTIVE_USERS: 'ACTIVE_USERS',
    GROUP_CALL_ROOMS: 'GROUP_CALL_ROOMS'
};


const server = app.listen(PORT, () => {
    console.log("Server is listening on port 5000");
});

const peerServer = ExpressPeerServer(server, {
    debug: true
});

app.use('/peerjs', peerServer);

// Create event listener for a new group call
groupCallServer.createPeerServerListeners(peerServer);

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

        // Let all users know the active rooms
        io.sockets.emit('broadcast', {
            event: broadcastEventTypes.GROUP_CALL_ROOMS,
            activeGroupCallRooms: groupCallRooms
        });
    });

    // event listener for when user disconnects by closing the webapp
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

        // if user disconnects during group call, we will remove the other active users from the call too
        // if the current user was the owner of the group call, array will have a value 
        groupCallRooms = groupCallRooms.filter(room => room.socketId !== socket.id);
        
        io.sockets.emit('broadcast', {
            event: broadcastEventTypes.GROUP_CALL_ROOMS,
            activeGroupCallRooms: groupCallRooms
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

    socket.on('hang-up', (data) => {
        console.log("User hung up");
        io.to(data.userSocketId).emit('hang-up');
    });

    // Event listeners related to group calls
    socket.on('group-call-register', (data) => {
        // Create a unique room id
        const roomId = uuidv4();
        socket.join(roomId);

        // Update server maintained list of active rooms
        const newGroupCallRoomData = {
            peerId: data.peerId,
            hostname : data.username,
            socketId: socket.id,
            roomId : roomId
        };
        groupCallRooms.push(newGroupCallRoomData);

        // send all active users the active rooms
        io.sockets.emit('broadcast', {
            event: broadcastEventTypes.GROUP_CALL_ROOMS,
            activeGroupCallRooms: groupCallRooms
        });
    });

    // when a user wants to join a group call
    socket.on('join-group-call-request', (data) => {
        //format of data: { myPeerId, hostSocketId, roomId, localStreamId }
        io.to(data.roomId).emit('join-group-call-request', {
            joineePeerId: data.peerId,
            hostSocketId: data.hostSocketId,
            localStreamId: data.localStreamId
        });

        socket.join(data.roomId);
    });

    socket.on('group-call-user-left', (data) => {
        socket.leave(data.roomId);
        // format of data: { streamId, roomId }
        io.to(data.roomId).emit('group-call-user-left', {
            streamId: data.streamId
        });
    });

    socket.on('group-call-closed-by-host', (data) => {             // data format: { peerId }
        // update active rooms list by removing the peerId's created room
        groupCallRooms = groupCallRooms.filter(room => room.peerId !== data.peerId); 

        // let all other users know about this 
        io.sockets.emit('broadcast', {
            event: broadcastEventTypes.GROUP_CALL_ROOMS,
            activeGroupCallRooms: groupCallRooms
        });
    });
});