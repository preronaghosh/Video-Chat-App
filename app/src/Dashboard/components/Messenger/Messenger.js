import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessageUsingDataChannel } from '../../../utils/webRtc/webRtcHandler';
import MessageDisplayer from './MessageDisplayer';
import { localStreamActions } from '../../../store/local-stream-slice';

import './Messenger.css';


const Messenger = () => {
    const dispatch = useDispatch();
    const chatMessage = useSelector(state => state.callLocalStream.chatMessage);

    useEffect(() => {
        setTimeout(() => {
            // update store state of chatMessage 5 sec after sending out a message on the data channel
            dispatch(localStreamActions.setChatMessage(false, ''));
        }, 5000); 
    }, [chatMessage, dispatch]);

    const [ inputValue, setInputValue ] = useState('');

    const inputChangeHandler = (event) => {
        setInputValue(event.target.value);
    };

    const keyDownHandler = (event) => {
        if (event.key === 'Enter') { // pressed Enter key
            sendMessageUsingDataChannel(inputValue);
            setInputValue('');            
        }
    };

    return (
        <>
            <input className='messages_input' type='text' value={inputValue} onChange={inputChangeHandler} 
                   onKeyDown={keyDownHandler} placeholder='Type your message..' /> 
            
            {chatMessage.received && <MessageDisplayer message={chatMessage.content}/>}
        </>
    );
};

export default Messenger;
