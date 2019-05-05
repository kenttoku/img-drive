const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { JWT_EXPIRY, JWT_SECRET } = require('../config');
const router = express.Router();
const localAuth = passport.authenticate('local', { session: false, failWithError: true });

function createAuthToken (user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}

router.post('/', localAuth, (req, res) => {
  const authToken = createAuthToken({ username: req.user.username });
  res.json({ authToken });
});

module.exports = router;
