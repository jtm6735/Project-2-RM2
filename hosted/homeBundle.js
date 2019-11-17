'use strict';

var QuizList = function QuizList(props) {
    if (props.quizzes.length === 0) {
        return React.createElement(
            'div',
            { className: 'quizzesList' },
            React.createElement(
                'h3',
                { className: 'emptyQuiz' },
                'No Quizzes Taken Yet'
            )
        );
    }

    var quizNodes = props.quizzes.map(function (quiz) {
        return React.createElement(
            'div',
            { key: quiz._id, className: 'quiz' },
            React.createElement('img', { src: '/assets/img/WUlogo.png', alt: 'domo face', className: 'quizFace' }),
            React.createElement(
                'h3',
                { className: 'quizName' },
                ' Name: ',
                quiz.name,
                ' '
            ),
            React.createElement(
                'h3',
                { className: 'quizAge' },
                ' Age: ',
                quiz.age,
                ' '
            ),
            React.createElement(
                'h3',
                { className: 'quizLevel' },
                ' Level: ',
                quiz.level,
                ' '
            )
        );
    });

    return React.createElement(
        'div',
        { className: 'quizList' },
        quizNodes
    );
};

var loadQuizzesFromServer = function loadQuizzesFromServer() {
    sendAjax('GET', '/getQuizzes', null, function (data) {
        ReactDOM.render(React.createElement(QuizList, { quizzes: data.quizzes }), document.querySelector('#quizzes'));
    });
};

var setup = function setup() {
    ReactDOM.render(React.createElement(QuizList, { quizzes: [] }), document.querySelector('#quizzes'));

    loadQuizzesFromServer();
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
