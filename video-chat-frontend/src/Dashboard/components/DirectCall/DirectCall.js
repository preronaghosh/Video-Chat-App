import { Fragment } from "react";
import LocalVideoView from "../LocalVideoView/LocalVideoView";
// import RemoteVideoView from '../RemoteVideoView/RemoteVideoView';
import { useSelector } from 'react-redux';

const DirectCall = () => {
    // Get callStream from redux store
    const localStream = useSelector(state => state.callLocalStream.localStream);
    
    return (
        <Fragment>
            <LocalVideoView localStream={localStream}/>
            {/* {callStream && <RemoteVideoView remoteStream={callStream}/>} */}
        </Fragment>
    );
};

export default DirectCall;
