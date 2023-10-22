import GroupCallButton from "../GroupCallButton/GroupCallButton";
import { useSelector } from 'react-redux';
import { callStates } from "../../../store/local-stream-slice";
import { createNewGroupCall, exitGroupCall } from "../../../utils/webRtc/webRtcGroupCallHandler";
import GroupCallRoom from "../GroupCallRoom/GroupCallRoom";
import VideoButtons from '../VideoButtons/VideoButtons';

const GroupCall = () => {
    const currentCallState = useSelector(state => state.callLocalStream.callState);
    const localStreamState = useSelector(state => state.callLocalStream.localStream);
    const groupCallState = useSelector(state => state.callLocalStream.groupCallActive);
    const groupCallStreams = useSelector(state => state.callLocalStream.groupCallStreams);

    const createRoomHandler = () => {
        // create room and send that data to all other active users
        createNewGroupCall();
    };

    const leaveRoomHandler = () => {
        exitGroupCall();
    };

    return (
        <>
            {/* Don't render create room button if a call is in progress or local stream is available */}
            {!groupCallState && localStreamState && currentCallState !== callStates.InProgress && <GroupCallButton label={'Create Room'} onClickHandler={createRoomHandler}/>} 
            {groupCallState && <GroupCallRoom groupCallStreams={groupCallStreams}/>}
            {groupCallState && <GroupCallButton label={'Leave Room'} onClickHandler={leaveRoomHandler}/>}

            {/* only render video buttons when it is a direct call, not a group call */}
            {currentCallState === callStates.InProgress && !groupCallState && <VideoButtons />}
        </>
    );
}

export default GroupCall;
