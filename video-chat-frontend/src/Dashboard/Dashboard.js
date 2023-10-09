import './Dashboard.css';
import logo from '../assets/logo.png';
import ActiveUsersList from './components/ActiveUsersList/ActiveUsersList';


const Dashboard = (props) => {
  return (
    <div className='dashboard_container background_main_color'>
      <div className='dashboard_left_section'>
        <div className='dashboard_content_container'>
          Content
        </div>
        <div className='dashboard_rooms_container background_secondary_color'>
          Rooms
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
