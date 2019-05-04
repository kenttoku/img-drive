const { Strategy: LocalStrategy } = require('passport-local');
const User = require('../models/user-model');

function validatePassword (password1, password2) {
  return password1 === password2;
}

const localStrategy = new LocalStrategy((username, password, done) => {
  let user;

  User.findOne({ where: { username } })
    .then(results => {
      user = results;
      if (!user) {
        return Promise.reject({ message: 'Username not found' });
      }
      return validatePassword(password, user.password);
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({ message: 'Invalid username or password' });
      }
      return done(null, user);
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return done(null, false);
      }
      return done(err);
    });
});

module.exports = localStrategy;