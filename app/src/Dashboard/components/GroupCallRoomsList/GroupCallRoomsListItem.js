import { joinGroupCall } from '../../../utils/webRtc/webRtcGroupCallHandler';

const GroupCallRoomsListItem = (props) => {
    const joinRoomHandler = () => {
        // join an existing room created by another user
        // data format here: {peerId, hostname, socketId, roomId }
        
        joinGroupCall(props.room.socketId, props.room.roomId);
    };

    return (
        <div className='group_calls_list_item' onClick={joinRoomHandler}>
            <span>{props.room.hostname}'s Room</span>
        </div>
    );
}

export default GroupCallRoomsListItem;
