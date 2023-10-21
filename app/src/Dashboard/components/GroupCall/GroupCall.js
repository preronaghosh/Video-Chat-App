import GroupCallButton from "../GroupCallButton/GroupCallButton";
import { useSelector } from 'react-redux';
import { callStates } from "../../../store/local-stream-slice";

const GroupCall = () => {
    const currentCallState = useSelector(state => state.callLocalStream.callState);
    const localStreamState = useSelector(state => state.callLocalStream.localStream);

    const createRoomHandler = () => {
        // create room and send that data to all other active users
    };

    return (
        <>
        {/* Don't render create room button if a call is in progress or local stream is available */}
        {localStreamState && currentCallState !== callStates.InProgress && <GroupCallButton label={'Create Room'} onClickHandler={createRoomHandler}/>} 
        </>
    );
}

export default GroupCall;
