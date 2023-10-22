import './GroupCallRoom.css';
import GroupCallVideo from './GroupCallVideo';

const GroupCallRoom = (props) => {

  return (
    <div className='group_call_room_container'>
      <span className='group_call_title'>Group Call</span>
      <div className='group_call_videos_container'>
        {
          props.groupCallStreams.map(stream => {
            return <GroupCallVideo key={stream.id} stream={stream}/>
          })
        }
      </div>
    </div>
  );
}

export default GroupCallRoom;
