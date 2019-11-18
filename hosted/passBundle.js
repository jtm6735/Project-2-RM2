"use strict";

var handleChange = function handleChange(e) {
    e.preventDefault();

    $("#quizMessage").animate({ width: 'hide' }, 350); //change

    if ($("#currPass").val() == '' || $("#newPass1").val() == '' || $("#newPass2").val() == '') {
        handleError("All fields are required.");
        console.log("All fields are required.");
        return false;
    }

    if ($('#newPass').val() !== $('#newPass1').val()) {
        handleError("The passwords do not match.");
        console.log("The passwords do not match.");
        return false;
    }

    if ($('#currPass').val() === $('#newPass').val()) {
        handleError("The new Password is the same as old password.");
        console.log("The new Password is the same as old password.");
        return false;
    }

    sendAjax('POST', '/changePassword', $('#changeForm').serialize(), function () {
        handleError('Password has changed');
    });

    return false;
};

var ChangeWindow = function ChangeWindow(props) {
    return React.createElement(
        "form",
        { id: "changeForm", name: "changeForm",
            onSubmit: handleChange,
            action: "/changePassword",
            method: "POST",
            className: "changeForm" },
        React.createElement(
            "label",
            { htmlFor: "username" },
            "Current Password: "
        ),
        React.createElement("input", { id: "currPass", type: "text", name: "currPass", placeholder: "Current Password" }),
        React.createElement(
            "label",
            { htmlFor: "pass" },
            "New Password: "
        ),
        React.createElement("input", { id: "newPass1", type: "password", name: "newPass1", placeholder: "New Password" }),
        React.createElement(
            "label",
            { htmlFor: "pass2" },
            "Retype New Password: "
        ),
        React.createElement("input", { id: "newPass2", type: "password", name: "newPass2", placeholder: "Retype New pPassword" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "change password" })
    );
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(ChangeWindow, { csrf: csrf }), document.querySelector('#content'));
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
'use strict';

var handleError = function handleError(message) {
  $('#errorMessage').text(message);
  $('#quizMessage').animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $('#quizMessage').animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
