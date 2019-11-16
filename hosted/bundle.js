'use strict';

var handleQuiz = function handleQuiz(e) {
    e.preventDefault();

    $('#quizMessage').animate({ width: 'hide' }, 350);

    if ($('#quizName').val() == '' || $('#quizAge').val() == '' || $('#quizLevel').val() == '') {
        handleError('RAWR! All fields are required');
        return false;
    }

    sendAjax('POST', $('#quizForm').attr('action'), $('#quizForm').serialize(), function () {
        loadQuizzesFromServer();
    });

    return false;
};

var QuizForm = function QuizForm(props) {
    return React.createElement(
        'form',
        { id: 'quizForm',
            onSubmit: handleQuiz,
            name: 'quizForm',
            action: '/maker',
            method: 'POST',
            className: 'quizForm' },
        React.createElement(
            'label',
            { htmlFor: 'name' },
            'Name: '
        ),
        React.createElement('input', { id: 'quizName', type: 'text', name: 'name', placeholder: 'Quiz Name' }),
        React.createElement(
            'label',
            { htmlFor: 'age' },
            'Age: '
        ),
        React.createElement('input', { id: 'quizAge', type: 'text', name: 'age', placeholder: 'Quiz Age' }),
        React.createElement(
            'label',
            { htmlFor: 'level' },
            'Level: '
        ),
        React.createElement('input', { id: 'quizLevel', type: 'text', name: 'level', placeholder: 'Quiz Level' }),
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { className: 'makeQuizSubmit', type: 'submit', value: 'Make Quiz' })
    );
};

var QuizList = function QuizList(props) {
    if (props.quizzes.length === 0) {
        return React.createElement(
            'div',
            { className: 'quizzesList' },
            React.createElement(
                'h3',
                { className: 'emptyQuiz' },
                'No Quizzes Yet'
            )
        );
    }

    var quizNodes = props.quizzes.map(function (quiz) {
        return React.createElement(
            'div',
            { key: quiz._id, className: 'quiz' },
            React.createElement('img', { src: '/assets/img/WUlogo.png', alt: 'domo face', className: 'domoFace' }),
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

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(QuizForm, { csrf: csrf }), document.querySelector('#makeQuiz'));

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
