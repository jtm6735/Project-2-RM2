const handleQuiz = (e) => {
    e.preventDefault();

    $('#quizMessage').animate({width:'hide'}, 350);

    if($('#quizName').val() == '' || $('#quizAge').val() == '' || $('#quizLevel').val() == '') {
        handleError('RAWR! All fields are required');
        return false;
    }

    sendAjax('POST', $('#quizForm').attr('action'), $('#quizForm').serialize(), function() {
        loadQuizzesFromServer();
    });

    return false;
};

const QuizForm = (props) => {
    return (
        <form id='quizForm'
        onSubmit={handleQuiz}
        name='quizForm'
        action='/maker'
        method='POST'
        className='quizForm' >
            <label htmlFor='name'>Name: </label>
            <input id='quizName' type='text' name='name' placeholder='Quiz Name' />
            <label htmlFor='age'>Age: </label>
            <input id='quizAge' type='text' name='age' placeholder='Quiz Age' />
            <label htmlFor='level'>Level: </label>
            <input id='quizLevel' type='text' name='level' placeholder='Quiz Level' />
            <input type='hidden' name='_csrf' value={props.csrf} />
            <input className='makeQuizSubmit' type='submit' value='Make Quiz' />
        </form>
    );
};

const QuizList = function(props) {
    if(props.quizzes.length === 0) {
        return (
            <div className='quizzesList'>
                <h3 className='emptyQuiz'>No Quizzes Yet</h3>
            </div>
        );
    }

    const quizNodes = props.quizzes.map(function(quiz) {
        return (
            <div key={quiz._id} className='quiz'>
                <img src='/assets/img/WUlogo.png' alt='domo face' className='domoFace'/>
                <h3 className='quizName'> Name: {quiz.name} </h3>
                <h3 className='quizAge'> Age: {quiz.age} </h3>
                <h3 className='quizLevel'> Level: {quiz.level} </h3>
            </div>
        );
    });

    return (
        <div className='quizList'>
            {quizNodes}
        </div>
    );
};

const loadQuizzesFromServer = () => {
    sendAjax('GET', '/getQuizzes', null, (data) => {
        ReactDOM.render(
            <QuizList quizzes={data.quizzes} />, document.querySelector('#quizzes')
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <QuizForm csrf={csrf}/>, document.querySelector('#makeQuiz')
    );

    ReactDOM.render(
        <QuizList quizzes={[]}/>, document.querySelector('#quizzes')
    );

    loadQuizzesFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});