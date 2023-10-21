const GroupCallRoomsListItem = (props) => {
    const joinRoomHandler = () => {

    };

    return (
        <div className='group_calls_list_item' onClick={joinRoomHandler}>
            <span>{props.room.hostName}'s Room</span>
        </div>
    );
}

export default GroupCallRoomsListItem;
