const models = require('../models');
const Quiz = models.Quiz;

const makerPage = (req, res) => {
  Quiz.QuizModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'an error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), quizzes: docs });
  });
};

const makeQuiz = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.level) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const quizData = {
    name: req.body.name,
    age: req.body.age,
    level: req.body.level,
    money: req.body.money,
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
