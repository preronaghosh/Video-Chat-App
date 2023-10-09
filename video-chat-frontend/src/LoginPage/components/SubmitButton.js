import React from 'react';

const SubmitButton = (props) => {
    
    const submitHandler = () => {
        props.handleSubmitButtonClicked();
    };

    return (
        <div className='login-page_button_container'>
            <button className='login-page_button background_main_color text_main_color' type='submit' onClick={submitHandler}>
                Start using video chat app!
            </button>
        </div>
    );
}

export default SubmitButton;
