import { useRef, useEffect } from 'react';

// Inline CSS styles for video container and tag
const styles = {
    videoContainer: {
      width: '100%',
      height: '100%'
    },
    videoElement: {
      width: '100%',
      height: '100%'
    }
  };

// This component receives the MediaStream object from Dashboard
const RemoteVideoView = props => { 
    const remoteVideoRef = useRef();
    useEffect(() => {
        if (props.remoteStream) {
            const remoteVideo = remoteVideoRef.current;
            remoteVideo.srcObject = props.remoteStream;

            // on some browsers, autoplay may not work 
            remoteVideo.onloadedmetadata = () => {
                remoteVideo.play();
            };
        }
    }, [props.remoteStream]);
    return (
        <div styles={styles.videoContainer}>
            <video styles={styles.videoElement} ref={remoteVideoRef} autoPlay />
        </div>
    )
};

export default RemoteVideoView;
