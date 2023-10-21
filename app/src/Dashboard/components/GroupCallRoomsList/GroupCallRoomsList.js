import './GroupCallRoomsList.css';

import GroupCallRoomsListItem from './GroupCallRoomsListItem';

const dummyList = [
    {
        roomId: '1234', 
        hostName: 'Mark'
    },
    {
        roomId: '5678',
        hostName: 'Paul'
    }
];
 

const GroupCallRoomsList = () => {
  return (
    <>
        {dummyList.map(room => <GroupCallRoomsListItem key={room.roomId} room={room}/>)}
    </>
  );
}

export default GroupCallRoomsList;
