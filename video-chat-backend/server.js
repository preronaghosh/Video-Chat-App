const express = require("express");
const socket = require("socket.io");

const PORT = 5000;
const app = express();

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
});