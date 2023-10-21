import store from '../../store/index';
import {registerGroupCall} from '../wssConnection/wssConnection';

// Variables to store peers in a group call related data 
let myPeer;
let myPeerId;

export const connectWithMyPeer = () => {
    myPeer = new window.Peer(undefined, {
        path: '/peerjs',
        host: '/',
        port: '5000'
    }); // setting undefined creates default IDs, else we can specify

    myPeer.on('open', (id) => {
        console.log(`Successfully connected with peer server id: ${id}`);
        myPeerId = id;
        console.log(`my peerId: ${myPeerId}`);
    });
};

export const createNewGroupCall = () => {
    registerGroupCall({
        username: store.getState().myDashboard.username,
        peerId: myPeerId
    });
};