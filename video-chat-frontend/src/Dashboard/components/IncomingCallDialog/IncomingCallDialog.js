import './IncomingCallDialog.css';

const IncomingCallDialog = (props) => {
    const acceptButtonHandler = () => {
    };
    const rejectButtonHandler = () => {};

    return (
        <div className='direct_call_dialog background_secondary_color'>
            <span className='direct_call_dialog_caller_name'>{props.callerUsername}</span>
            <div className='direct_call_dialog_button_container'>
                <button className='direct_call_dialog_accept_button' onClick={acceptButtonHandler}>Accept</button>
                <button className='direct_call_dialog_reject_button' onClick={rejectButtonHandler}>Reject</button>
            </div>
        </div>
    );
}

export default IncomingCallDialog;
