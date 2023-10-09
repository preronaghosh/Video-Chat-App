import './ActiveUsersList.css';
import userAvatar from '../../../assets/userAvatar.png';

const ActiveUsersListItem = (props) => {
    const handleUserClick = () => {};

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
