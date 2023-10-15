import { useEffect } from 'react';
import './CallRejectedDialog.css';
import { useSelector, useDispatch } from 'react-redux';
import { localStreamActions } from '../../../store/local-stream-slice';

const CallRejectedDialog = () => {
  const callRejectionDetails = useSelector(state => state.callLocalStream.callRejectionDetails);
  const dispatch = useDispatch();
  
  // Hide dialog box after 4 seconds since this component was rendered
  useEffect(() => {
    setTimeout(() => {
      dispatch(localStreamActions.setCallRejectionDetails({
        rejected: false,
        reason: ''
      })); 
    }, 4000); // 4 secs
  }, []);
  
  return (
    <div className='call_rejected_dialog background_secondary_color'>
      <span>{callRejectionDetails.reason}</span>
    </div>
  )
};

export default CallRejectedDialog;
