const express = require('express');
const passport = require('passport');
const router = express.Router();
const localAuth = passport.authenticate('local', { session: false, failWithError: true });
const createAuthToken = require('../utils/create-auth-token');

router.post('/', localAuth, (req, res) => {
  const authToken = createAuthToken({ username: req.user.username });
  res.json(authToken);
});

module.exports = router;
