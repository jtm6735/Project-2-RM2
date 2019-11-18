const handleChange = (e) => {
    e.preventDefault();

    $("#quizMessage").animate({width: 'hide'}, 350);//change

    if($("#currPass").val() == '' || $("#newPass1").val() == '' || $("#newPass2").val() == '') {
        handleError("All fields are required.");
        console.log("All fields are required.");
        return false;
    }

    if($('#newPass').val() !== $('#newPass1').val()) {
        handleError("The passwords do not match.");
        console.log("The passwords do not match.");
        return false;
    }

    if($('#currPass').val() === $('#newPass').val()) {
        handleError("The new Password is the same as old password.");
        console.log("The new Password is the same as old password.");
        return false;
    }

    sendAjax('POST', '/changePassword', $('#changeForm').serialize(), () => {
        handleError('Password has changed');
    });

    return false;
};

const ChangeWindow = (props) => {
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
            <input id='newPass2' type='password' name='newPass2' placeholder='Retype New pPassword' />
            <input type='hidden' name='_csrf' value={props.csrf} />
            <input className='formSubmit' type='submit' value='change password' />
        </form>
    );
};

const setup = (csrf) => {
    ReactDOM.render(
        <ChangeWindow csrf={csrf} />,
        document.querySelector('#content')
    );
};


const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});