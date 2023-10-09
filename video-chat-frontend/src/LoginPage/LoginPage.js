// React hooks
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

// Asset imports
import logo from '../assets/logo.png';
import './LoginPage.css';

// Component and store imports
import UsernameInput from './components/UsernameInput';
import SubmitButton from './components/SubmitButton';
import { dashboardActions } from '../store/dashboard-slice';


const LoginPage = () => {
  const [username, setUsername] = useState(''); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleSubmitButtonClicked = () => {
    navigate('/dashboard');
    dispatch(dashboardActions.setUsername(username));
  };

  return (
    <div className='login-page_container background_main_color'>
      <div className='login-page_login_box back background_secondary_color'>
        <div className='login-page_logo_container'>
          <img className='login-page_logo_image'src={logo} alt='VideoChat App'/>
        </div>
        <div className='login-page_title_container'>
          Get On Board!
        </div>
        <UsernameInput username={username} setUsername={setUsername}/>
        <SubmitButton handleSubmitButtonClicked={handleSubmitButtonClicked}/>
      </div>
    </div>
  )
};

export default LoginPage;
