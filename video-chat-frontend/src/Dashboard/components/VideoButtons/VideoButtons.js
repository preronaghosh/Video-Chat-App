import { MdCallEnd, MdMic, MdMicOff, MdVideocam, MdVideocamOff, MdVideoLabel, MdVideoCall } from 'react-icons/md';
import VideoButton from './VideoButton';  

// Redux related hooks
import { useDispatch, useSelector } from 'react-redux';
import { localStreamActions } from '../../../store/local-stream-slice';

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
  const localStream = useSelector(state => state.callLocalStream.localStream);

  const microphoneClickHandler = () => {
    localStream.getAudioTracks()[0].enabled = !microphoneState;
    dispatch(localStreamActions.setLocalMicrophoneEnabled(!microphoneState));
  };

  const cameraClickHandler = () => {
    localStream.getVideoTracks()[0].enabled = !cameraState;
    dispatch(localStreamActions.setLocalCameraEnabled(!cameraState));    
  };

  return (
    <div style={styles.buttonContainer}>
        <VideoButton onClickHandler={microphoneClickHandler}>
          {microphoneState ? <MdMic style={styles.icon} /> : <MdMicOff style={styles.icon}/>}
        </VideoButton>
        <VideoButton>
          <MdCallEnd style={styles.icon}/>
        </VideoButton>
        <VideoButton onClickHandler={cameraClickHandler}>
          {cameraState ? <MdVideocam style={styles.icon} /> : <MdVideocamOff style={styles.icon}/>}
        </VideoButton>
        <VideoButton>
          <MdVideoLabel style={styles.icon}/>
        </VideoButton>
    </div>
  )
}

export default VideoButtons;
