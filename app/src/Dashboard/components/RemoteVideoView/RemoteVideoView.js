import { useRef, useEffect } from 'react';

// Inline CSS styles for video container and tag
const styles = {
    videoContainer: {
        width: '100%',
        height: '100%'
    },
    videoElement: {
        padding: '0',
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
        <div style={styles.videoContainer}>
            <video style={styles.videoElement} ref={remoteVideoRef} autoPlay />
        </div>
    )
};

export default RemoteVideoView;
