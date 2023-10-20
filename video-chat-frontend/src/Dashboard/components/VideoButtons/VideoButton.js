const styles = {
    button: {
      width: '50px',
      height: '50px',
      borderRadius: '40px',
      border: '2px solid #e6e5e8',
      textDecoration: 'none',
      backgroundColor: '#282C34',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: '10px',
      boxShadow: 'none',
      borderImage: 'none',
      borderStyle: 'none',
      borderWidth: '0px',
      outline: 'none'
    }
};

const VideoButton = (props) => {
  const clickHandler = () => {
    props.onClickHandler();
  };

  return (
    <button style={styles.button} onClick={clickHandler}>
      {props.children}
    </button>
  )
};

export default VideoButton;
