// Checks for both inputs to be filled
// with text. If no text is in one or either
// box, an error will be thrown.
const handleLogin = (e) => {
    e.preventDefault();

    $("#quizMessage").animate({width: 'hide'}, 350);

    if($("#user").val() == '' || $("#pass").val() == '') {
        handleError("Username or password is empty!");
        return false;
    }

    console.log($("input[name=_csrf").val());

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

// Check to see if the new user has
// filled out the fields
// Check if both passwords match
const handleSignup = (e) => {
    e.preventDefault();

    $("#quizMessage").animate({width: 'hide'}, 350);

    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required.");
        return false;
    }

    if($('#pass').val() !== $('#pass2').val()) {
        handleError("Passwords do not match.");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

// Creates form used to login with
// username and password
const LoginWindow = (props) => {
    return (
        <form id='loginForm' name='loginForm'
            onSubmit={handleLogin}
            action='/login'
            method='POST'
            className='mainForm'>
            <label htmlFor='username'>Username: </label>
            <input id='user' type='text' name='username' placeholder='Username' />
            <label htmlFor='pass'>Password: </label>
            <input id='pass' type='password' name='pass' placeholder='Password' />
            <input type='hidden' name='_csrf' value={props.csrf} />
            <input className='formSubmit' type='submit' value='Sign in' />
        </form>
    );
};

// Creates form for signing up
// This form uses the username,
// password, and confirmed password
const SignupWindow = (props) => {
    return (
        <form id='signupForm' name='signupForm'
            onSubmit={handleSignup}
            action='/signup'
            method='POST'
            className='mainForm'>
            <label htmlFor='username'>Username: </label>
            <input id='user' type='text' name='username' placeholder='Username' />
            <label htmlFor='pass'>Password: </label>
            <input id='pass' type='password' name='pass' placeholder='Password' />
            <label htmlFor='pass2'>Password: </label>
            <input id='pass2' type='password' name='pass2' placeholder='Retype Password' />
            <input type='hidden' name='_csrf' value={props.csrf} />
            <input className='formSubmit' type='submit' value='Sign up' />
        </form>
    );
};

// Creates login view in the center of the page
const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector('#content')
    );
};

// Creates login view in the center of the page
const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector('#content')
    );
};

// Depending on if login or sign up is clicked,
// a different view is created
const setup = (csrf) => {
    const loginButton = document.querySelector('#loginButton');
    const signupButton = document.querySelector('#signupButton');

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        createLoginWindow();
        return false;
    });

    createLoginWindow(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

// Load in the csrf token
$(document).ready(function() {
    getToken();
});