import './GroupCallButton.css';

const GroupCallButton = (props) => {
    const buttonClickHandler = () => {
        props.onClickHandler();
    };

    return (
        <button className='group_call_button' onClick={buttonClickHandler}>
            {props.label}
        </button>
    )
}

export default GroupCallButton;
