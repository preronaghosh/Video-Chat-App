const createPeerServerListeners = (peerServer) => {
    peerServer.on('connection', (client) => {
        console.log(`${client.id} successfully connected to peerServer.`);
    });
};

module.exports = { createPeerServerListeners };