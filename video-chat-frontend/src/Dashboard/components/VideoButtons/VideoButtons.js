import { MdCallEnd, MdMic, MdMicOff, MdVideocam, MdVideocamOff, MdScreenShare, MdStopScreenShare } from 'react-icons/md';
import VideoButton from './VideoButton';  

// Redux related hooks
import { useDispatch, useSelector } from 'react-redux';
import { localStreamActions } from '../../../store/local-stream-slice';
import { switchToScreenSharing } from '../../../utils/webRtc/webRtcHandler';
import { hangUpCall } from '../../../utils/webRtc/webRtcHandler';

const styles = {
    buttonContainer: {
        display: 'flex',
        position: 'absolute',
        bottom: '22%',
        left: '35%'
    },
    icon: {
        width: '25px',
        height: '25px',
        fill: '#e6e5e8'
    }
};

const VideoButtons = () => {
  const dispatch = useDispatch();
  const microphoneState = useSelector(state => state.callLocalStream.localMicrophoneEnabled);
  const cameraState = useSelector(state => state.callLocalStream.localCameraEnabled);
  const screenShareState = useSelector(state => state.callLocalStream.localScreenShareEnabled);
  const localStream = useSelector(state => state.callLocalStream.localStream);

  const microphoneClickHandler = () => {
    localStream.getAudioTracks()[0].enabled = !microphoneState;
    dispatch(localStreamActions.setLocalMicrophoneEnabled(!microphoneState));
  };

  const cameraClickHandler = () => {
    localStream.getVideoTracks()[0].enabled = !cameraState;
    dispatch(localStreamActions.setLocalCameraEnabled(!cameraState));    
  };

  const screenShareClickHandler = () => {
    switchToScreenSharing();
  };

  const hangUpCallHandler = () => {
    hangUpCall();
  }

  return (
    <div style={styles.buttonContainer}>
        <VideoButton onClickHandler={microphoneClickHandler}>
          {microphoneState ? <MdMic style={styles.icon} /> : <MdMicOff style={styles.icon}/>}
        </VideoButton>
        <VideoButton onClickHandler={hangUpCallHandler}>
          <MdCallEnd style={styles.icon}/>
        </VideoButton>
        <VideoButton onClickHandler={cameraClickHandler}>
          {cameraState ? <MdVideocam style={styles.icon} /> : <MdVideocamOff style={styles.icon}/>}
        </VideoButton>
        <VideoButton onClickHandler={screenShareClickHandler}>
          {screenShareState ? <MdStopScreenShare style={styles.icon}/> : <MdScreenShare style={styles.icon} />}
        </VideoButton>
    </div>
  )
}

export default VideoButtons;
