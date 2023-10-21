const UsernameInput = (props) => {
    const {username, setUsername} = props;
    
    const inputChangeHandler = (event) => {
        setUsername(event.target.value);
    }

    return (
        <div className="login-page_input_container">
        <input type='text' value={username} onChange={inputChangeHandler} placeholder='Enter your name' className="login-page_input background_main_color text_main_color"/>
        </div>
    )
};

export default UsernameInput;
