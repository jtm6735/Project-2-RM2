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
                <h3 className='quizName'> Name: {quiz.name} </h3>
                <h3 className='quizColor'> Age: {quiz.color} </h3>
                <h3 className='quizHobby'> Hobby: {quiz.hobby} </h3>
                <h3 className='quizAnimal'> Animal: {quiz.animal} </h3>
                <h3 className='quizNumber'> Number: {quiz.number} </h3>
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