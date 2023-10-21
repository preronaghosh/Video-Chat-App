let myPeer;

export const connectWithMyPeer = () => {
    myPeer = new window.Peer(undefined, {
        path: '/peerjs',
        host: '/',
        port: '5000'
    }); // setting undefined creates default IDs, else we can specify

    myPeer.on('open', (id) => {
        console.log(`Successfully connected with peer server id: ${id}`);
    });
};