import './DashboardInfo.css';
import { useSelector } from 'react-redux';

const DashboardInfo = () => {
    const username = useSelector(state => state.myDashboard.username);

    return (
        <div className='dashboard_info_text_container'>
        <span className='dashboard_info_text_title'>
            Hello {username}. Welcome to our VideoChatApp!
        </span>
        <span className='dashboard_info_text_description'>
            You can start a direct call with active users from the list or you can create/join a group call.
        </span>
        </div>
    );
};

export default DashboardInfo;