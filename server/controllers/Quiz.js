const models = require('../models');
const Quiz = models.Quiz;

// Creates the page for making quizzes
// Passes in the csrf token
const makerPage = (req, res) => {
  Quiz.QuizModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'an error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), quizzes: docs });
  });
};

// Makes a new quiz to be filled out
// Checks for all valid fields
const makeQuiz = (req, res) => {
  if (!req.body.name || !req.body.color || !req.body.hobby || !req.body.animal 
      || !req.body.number) {
      console.dir(req.body.name);
      console.dir(req.body.color);
      console.dir(req.body.hobby);
      console.dir(req.body.animal);
      console.dir(req.body.number);
      return res.status(400).json({ error: 'All fields are required' });
  }
  const quizData = {
    name: req.body.name,
    color: req.body.color,
    hobby: req.body.hobby,
    animal: req.body.animal,
    number: req.body.number,
    owner: req.session.account._id,
  };

  const newQuiz = new Quiz.QuizModel(quizData);

  const quizPromise = newQuiz.save();

  quizPromise.then(() => res.json({ redirect: '/maker' }));

  quizPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Quiz already in use' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  });
  return quizPromise;
};

// Load previous quizzes from the server
const getQuizzes = (request, response) => {
  const req = request;
  const res = response;

  return Quiz.QuizModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ quizzes: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getQuizzes = getQuizzes;
module.exports.make = makeQuiz;
