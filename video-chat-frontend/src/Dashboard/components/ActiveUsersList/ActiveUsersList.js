import './ActiveUsersList.css';
import ActiveUsersListItem from './ActiveUsersListItem';
import { useSelector } from 'react-redux'; 

const ActiveUsersList = () => {
  const activeUsers = useSelector(state => state.myDashboard.activeUsers);

  return (
    <ul className='active_user_list_container'>
        {activeUsers.map((user) => <ActiveUsersListItem key={user.socketId} activeUser={user}/>)}        
    </ul>
  )
};

export default ActiveUsersList;
