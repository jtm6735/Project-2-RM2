const QuizList = function(props) {
    if(props.quizzes.length === 0) {
        return (
            <div className='quizzesList'>
                <h3 className='emptyQuiz'>No Quizzes Taken Yet</h3>
            </div>
        );
    }

    const quizNodes = props.quizzes.map(function(quiz) {
        return (
            <div key={quiz._id} className='quiz'>
                <img src='/assets/img/WUlogo.png' alt='domo face' className='quizFace'/>
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

const setup = function() {
    ReactDOM.render(
        <QuizList quizzes={[]} />, document.querySelector('#quizzes')
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