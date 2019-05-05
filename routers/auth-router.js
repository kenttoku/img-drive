const express = require('express');
const passport = require('passport');

const router = express.Router();
const localAuth = passport.authenticate('local', { session: false, failWithError: true });

router.post('/', localAuth, (req, res) => {
  return res.json({ username: req.user.username });
});

module.exports = router;
