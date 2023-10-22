import './GroupCallRoomsList.css';
import { useSelector } from 'react-redux';

import GroupCallRoomsListItem from './GroupCallRoomsListItem'; 

const GroupCallRoomsList = () => {
  const activeRooms = useSelector(state => state.myDashboard.activeRooms);
  console.log("Activerooms: ", activeRooms);

  return (
    <>
      {activeRooms.map(room => <GroupCallRoomsListItem key={room.roomId} room={room}/>)}
    </>
  );
}

export default GroupCallRoomsList;
