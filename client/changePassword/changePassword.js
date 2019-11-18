// Checks if the user has filled in all the fields
// Depending on varying outcomes, the error message is different
const handleChange = (e) => {
    e.preventDefault();

    $("#quizMessage").animate({width: 'hide'}, 350);//change

    if($("#currPass").val() == '' || $("#newPass1").val() == '' || $("#newPass2").val() == '') {
        handleError("All fields are required.");
        return false;
    }

    if($('#newPass').val() !== $('#newPass1').val()) {
        handleError("The passwords do not match.");
        return false;
    }

    if($('#currPass').val() === $('#newPass').val()) {
        handleError("The new Password is the same as old password.");
        return false;
    }

    sendAjax('POST', '/changePassword', $('#changeForm').serialize(), () => {
        handleError('The Password has been changed');
    });

    return false;
};

// Create the changed password with the
// current, new, and confirmed new password
const ChangePassword = (props) => {
    return (
        <form id='changeForm' name='changeForm'
            onSubmit={handleChange}
            action='/changePassword'
            method='POST'
            className='changeForm'>
            <label htmlFor='username'>Current Password: </label>
            <input id='currPass' type='text' name='currPass' placeholder='Current Password' />
            <label htmlFor='pass'>New Password: </label>
            <input id='newPass1' type='password' name='newPass1' placeholder='New Password' />
            <label htmlFor='pass2'>Retype New Password: </label>
            <input id='newPass2' type='password' name='newPass2' placeholder='Retype New Password' />
            <input type='hidden' name='_csrf' value={props.csrf} />
            <input className='formSubmit' type='submit' value='Change Password' />
        </form>
    );
};

// Preps to render error messages in content
const setup = (csrf) => {
    ReactDOM.render(
        <ChangePassword csrf={csrf} />,
        document.querySelector('#content')
    );
};


const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

// Displays content from the setup
$(document).ready(function() {
    getToken();
});