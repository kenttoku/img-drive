const express = require('express');
const User = require('../models/user-model');
const createAuthToken = require('../utils/create-auth-token');

const router = express.Router();

router.post('/', (req, res, next) => {
  const { username, password } = req.body;
  return User.create({
    username,
    password
  }).then(result => {
    const authToken = createAuthToken({ username: result.dataValues.username });
    res.json(authToken);
  }).catch(err => next(err));
});

module.exports = router;
