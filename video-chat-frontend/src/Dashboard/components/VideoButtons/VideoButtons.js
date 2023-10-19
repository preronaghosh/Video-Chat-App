import { MdCallEnd, MdMic, MdMicOff, MdVideocam, MdVideocamOff, MdVideoLabel, MdVideoCall, MdVideoCameraFront } from 'react-icons/md';
import VideoButton from './VideoButton';  

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
  return (
    <div style={styles.buttonContainer}>
        <VideoButton>
          <MdMic style={styles.icon}/>
        </VideoButton>
        <VideoButton>
          <MdCallEnd style={styles.icon}/>
        </VideoButton>
        <VideoButton>
          <MdVideoCameraFront style={styles.icon}/>
        </VideoButton>
        <VideoButton>
          <MdVideoLabel style={styles.icon}/>
        </VideoButton>
    </div>
  )
}

export default VideoButtons;
