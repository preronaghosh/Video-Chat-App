import { hangUpCall } from '../../../utils/webRtc/webRtcHandler';
import './CallingDialog.css';
import { MdCallEnd } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { localStreamActions } from '../../../store/local-stream-slice';


const CallingDialog = () => {
  const dispatch = useDispatch();

  const endCallClickHandler = () => {
    // when user wants to hand up call before callee accepts/rejects the call
    hangUpCall();
    dispatch(localStreamActions.setCallingDialogVisible(false));
  }

  return (
    <div className='direct_calling_dialog background_secondary_color'>
      <span>Calling..</span>
      <div className='button-container-for-call' onClick={endCallClickHandler}>
        <MdCallEnd className='button-element-for-call'/>
      </div>
    </div>
  )
};

export default CallingDialog;
