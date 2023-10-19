import { Fragment } from "react";
import LocalVideoView from "../LocalVideoView/LocalVideoView";
import RemoteVideoView from '../RemoteVideoView/RemoteVideoView';
import { useSelector } from 'react-redux';

// React component imports
import IncomingCallDialog from "../IncomingCallDialog/IncomingCallDialog";
import CallingDialog from '../CallingDialog/CallingDialog';
import CallRejectedDialog from "../CallRejectedDialog/CallRejectedDialog";
import { callStates } from "../../../store/local-stream-slice";


const DirectCall = () => {
    
    // Get direct call related state from redux store
    const localStream = useSelector(state => state.callLocalStream.localStream);
    const callingDialogVisibility = useSelector(state => state.callLocalStream.callingDialogVisible);
    const callerUsername = useSelector(state => state.callLocalStream.callerUsername);
    const currentCallState = useSelector(state => state.callLocalStream.callState);
    const callRejectionDetails = useSelector(state => state.callLocalStream.callRejectionDetails);
    const remoteCallStream = useSelector(state => state.callLocalStream.remoteStream);
    
    return (
        <Fragment>
            <LocalVideoView localStream={localStream}/>
            {remoteCallStream && <RemoteVideoView remoteStream={remoteCallStream}/>}
            {callRejectionDetails.rejected && <CallRejectedDialog />}
            {currentCallState === callStates.Requested && <IncomingCallDialog callerUsername={callerUsername}/>}
            {callingDialogVisibility && <CallingDialog />}
        </Fragment>
    );
};

export default DirectCall;
