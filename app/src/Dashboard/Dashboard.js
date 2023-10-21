import './Dashboard.css';
import logo from '../assets/logo.png';
import ActiveUsersList from './components/ActiveUsersList/ActiveUsersList';
import { getLocalStream } from '../utils/webRtc/webRtcHandler';
import { useEffect } from 'react';
import DirectCall from './components/DirectCall/DirectCall';
import DashboardInfo from './components/DashboardInfo/DashboardInfo';
import { connectWithMyPeer } from '../utils/webRtc/webRtcGroupCallHandler';
import GroupCallRoomsList from './components/GroupCallRoomsList/GroupCallRoomsList';
import { useSelector } from 'react-redux';
import { callStates } from '../store/local-stream-slice';

const Dashboard = () => {
  const currentCallState = useSelector(state => state.callLocalStream.callState); 
  useEffect(() => {
    getLocalStream();
    connectWithMyPeer();
  }, []);

  return (
    <div className='dashboard_container background_main_color'>
      <div className='dashboard_left_section'>
        <div className='dashboard_content_container'>
          <DirectCall />
          {currentCallState !== callStates.InProgress && <DashboardInfo />}
        </div>
        <div className='dashboard_rooms_container background_secondary_color'>
          <GroupCallRoomsList />
        </div>
      </div>
      <div className='dashboard_right_section background_secondary_color'>
        <div className='dashboard_active_users_list'>
          <ActiveUsersList />
        </div>
        <div className='dashboard_logo_container'>
          <img className='dashboard_logo_image' src={logo} alt="VideoChat App"/>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
