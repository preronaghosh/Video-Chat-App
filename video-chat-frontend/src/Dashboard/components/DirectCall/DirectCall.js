import { Fragment } from "react";
import LocalVideoView from "../LocalVideoView/LocalVideoView";
// import RemoteVideoView from '../RemoteVideoView/RemoteVideoView';
import { useSelector } from 'react-redux';

// React component imports
import IncomingCallDialog from "../IncomingCallDialog/IncomingCallDialog";
import CallingDialog from '../CallingDialog/CallingDialog';
import CallRejectedDialog from "../CallRejectedDialog/CallRejectedDialog";


const DirectCall = () => {
    // Get callStream from redux store
    const localStream = useSelector(state => state.callLocalStream.localStream);
    
    return (
        <Fragment>
            <LocalVideoView localStream={localStream}/>
            {/* {callStream && <RemoteVideoView remoteStream={callStream}/>} */}
            {/* <CallRejectedDialog /> */}
            {/* <IncomingCallDialog /> */}
            {/* <CallingDialog /> */}
        </Fragment>
    );
};

export default DirectCall;
