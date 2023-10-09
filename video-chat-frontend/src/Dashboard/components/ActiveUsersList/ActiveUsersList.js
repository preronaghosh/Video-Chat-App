import './ActiveUsersList.css';
import ActiveUsersListItem from './ActiveUsersListItem';

// Dummy List
const activeUsers = [
    {
      socketId: 321,
      username: 'Paul'
    },
    {
      socketId: 333,
      username: 'John'
    },
    {
      socketId: 432,
      username: 'Kate'
    },
    {
      socketId: 345,
      username: 'Adam'
    }
];

const ActiveUsersList = () => {
  return (
    <ul className='active_user_list_container'>
        {activeUsers.map((user) => <ActiveUsersListItem key={user.socketId} activeUser={user}/>)}        
    </ul>
  )
};

export default ActiveUsersList;
