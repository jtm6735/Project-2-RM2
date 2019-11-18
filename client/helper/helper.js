const handleError = (message) => {
  $('#errorMessage').text(message);
  $('#quizMessage').animate({height: 'toggle'}, 300);
};

const redirect = (response) => {
  $('#quizMessage').animate({height: 'hide'}, 350);
  window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
  $.ajax({
      cache: false,
      type: type,
      url: action,
      data: data,
      dataType: 'json',
      success: success,
      error: function(xhr, status, error) {
          var messageObj = JSON.parse(xhr.responseText);
          handleError(messageObj.error);
      }
  });
};