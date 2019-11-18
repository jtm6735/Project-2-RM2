const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const quizPage = (req, res) => {
  res.render('quiz');
};

const upgradePage = (req, res) => {
  res.render('upgrade');
};

const passwordPage = (req,res) => {
    res.render('changePassword');
};

const notFoundPage = (req, res) => {
  res.render('notFound', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;


  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws;
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };


    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();


    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use' });
      }
      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

// Change password for the user
// Checks that forms will be filled out so password can be changed
const changePassword = (request, response) => {
  const req = request;
  const res = response;

  // force case to strings to cover security flaws
  const currentPass = `${req.body.currPass}`;
  const newPass = `${req.body.newPass}`;
  const newPass2 = `${req.body.newPass2}`;

  if (!currentPass || !newPass || !newPass2) {
    return res.status(400).json({ error: 'All fields required.' });
  }

  return Account.AccountModel.authenticate(`${req.session.account.username}`, currentPass,
    (err, pass) => {
      if (err || !pass) {
        return res.status(401).json({ error: 'Current password is incorrect. Help' });
      }

      return Account.AccountModel.generateHash(newPass, (salt, hash) => {
        const searchUser = {
          username: `${req.session.account.username}`,
        };

        Account.AccountModel.update(searchUser, { $set: { password: hash, salt } }, {}, (error) => {
          if (error) {
            return res.status(500).json({ error: 'Unable to update password.' });
          }

          return res.status(200).json({ redirect: '/maker' });
        });
      });
    }
  );
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.passwordPage = passwordPage;
module.exports.notFoundPage = notFoundPage;
module.exports.quizPage = quizPage;
module.exports.changePassword = changePassword;
module.exports.signup = signup;
module.exports.getToken = getToken;
