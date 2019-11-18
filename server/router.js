const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getQuizzes', mid.requiresSecure, controllers.Quiz.getQuizzes);
  app.get('/quizPage', mid.requiresSecure, controllers.Account.quizPage);
  //app.get('/upgradePage', mid.requiresSecure, mid.requiresLogin, )
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/passwordPage', mid.requiresSecure, controllers.Account.passwordPage);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Quiz.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Quiz.make);
  app.post('/changePassword', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePassword);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/*', mid.requiresSecure, mid.requiresLogin, controllers.Account.notFoundPage);
};

module.exports = router;
