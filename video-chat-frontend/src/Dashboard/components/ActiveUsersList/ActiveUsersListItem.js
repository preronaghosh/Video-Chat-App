import userAvatar from '../../../assets/userAvatar.png';
import { callStates } from '../../../store/local-stream-slice';
import { callAnotherUser } from '../../../utils/webRtc/webRtcHandler';
import { useSelector } from 'react-redux';


const ActiveUsersListItem = (props) => {
    const callState = useSelector(state => state.callLocalStream.callState);

    const handleUserClick = () => {
        // call this user
        if (callStates.Available === callState) {
            callAnotherUser(props.activeUser); 
        }
    };

    return (
        <div className='active_user_list_item' onClick={handleUserClick}>
            <div className='active_user_list_image_container'>
                <img className='active_user_list_image' src={userAvatar} alt="User"/>
            </div>
            <span className='active_user_list_text'>
                {props.activeUser.username}
            </span>
        </div>
    )
}

export default ActiveUsersListItem;
