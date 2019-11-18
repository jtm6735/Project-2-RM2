// Checks for if all the required fields
// have been given values. Throws an error
// if this happens.
const handleQuiz = (e) => {
    e.preventDefault();

    $('#quizMessage').animate({width:'hide'}, 350);

    if($('#quizName').val() == '' || $('#quizColor').val() == '' || $('#quizHobby').val() == '' || $('#quizAnimal').val() == '' || $('#quizNumber').val() == '') {
        handleError('Not all questions have been answered');
        return false;
    }

    sendAjax('POST', $('#quizForm').attr('action'), $('#quizForm').serialize(), function() {
        loadQuizzesFromServer();
    });

    return false;
};

// Creates a quiz form for users to fill out 
// and answer
const QuizForm = (props) => {
    return (
        <form id='quizForm'
        onSubmit={handleQuiz}
        name='quizForm'
        action='/maker'
        method='POST'
        className='quizForm' >
            <label htmlFor='name'>Name: </label>
            <input id='quizName' type='text' name='name' placeholder='Name?' />
            <label htmlFor='color'>Color: </label>
            <input id='quizColor' type='text' name='color' placeholder='Favorite Color?'/>
            <label htmlFor='hobby'>Hobby: </label>
            <input id='quizHobby' type='text' name='hobby' placeholder='Have a hobby?'/>
            <label htmlFor='animal'>Animal: </label>
            <input id='quizAnimal' type='text' name='animal' placeholder='Favorite animal?'/>
            <label htmlFor='number'>Number: </label>
            <input id='quizNumber' type='text' name='number' placeholder='Favorite number?'/>
            <input type='hidden' name='_csrf' value={props.csrf} />
            <input className='makeQuizSubmit' type='submit' value='Complete Quiz' />
        </form>
    );
};

// Creates the list of quiz answers
// If nothing had been completed, no data gets shown
const QuizList = function(props) {
    if(props.quizzes.length === 0) {
        return (
            <div className='quizzesList'>
                <h3 className='emptyQuiz'>No Quizzes Finished Yet</h3>
            </div>
        );
    }

    const quizNodes = props.quizzes.map(function(quiz) {
        return (
            <div key={quiz._id} className='quiz'>
                <h3 className='quizName'> Name: {quiz.name} </h3>
                <h3 className='quizColor'> Age: {quiz.color} </h3>
                <h3 className='quizHobby'> Hobby: {quiz.hobby} </h3>
                <h3 className='quizAnimal'> Animal: {quiz.animal} </h3>
                <h3 className='quizNumber'> Number: {quiz.number} </h3>
            </div>
        );
    });
};

// Gets the list of quizzes from the server
const loadQuizzesFromServer = () => {
    sendAjax('GET', '/getQuizzes', null, (data) => {
    });
};

// 
const setup = function(csrf) {
    ReactDOM.render(
        <QuizForm csrf={csrf}/>, document.querySelector('#makeQuiz')
    );
};

// Gets the csrf token
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

// Creates the setup
$(document).ready(function() {
    getToken();
});