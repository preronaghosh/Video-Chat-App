import { useRef, useEffect } from 'react';

// Inline CSS styles for video container and tag
const styles = {
    videoContainer: {
      width: '200px',
      height: '150px',
      borderRadius: '8px',
      position: 'absolute',
      top: '5%',
      right: '23%'
    },
    videoElement: {
      width: '100%',
      height: '100%',
      borderRadius: '10px'
    }
};

// This component receives the MediaStream object from Dashboard
const LocalVideoView = props => { 
    const localVideoRef = useRef();
    useEffect(() => {
        if (props.localStream) {
            const localVideo = localVideoRef.current;
            localVideo.srcObject = props.localStream;

            // on some browsers, autoplay may not work 
            localVideo.onloadedmetadata = () => {
                localVideo.play();
            };
        }
    }, [props.localStream]);
    return (
        <div style={styles.videoContainer} >
            <video style={styles.videoElement} ref={localVideoRef} autoPlay muted />
        </div>
    )
};

export default LocalVideoView;
