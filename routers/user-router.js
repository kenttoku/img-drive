const express = require('express');
const User = require('../models/user-model');

const router = express.Router();

router.post('/', (req, res, next) => {
  const { username, password } = req.body;
  return User.create({
    username,
    password
  }).then(result => {
    return res.status(201).location(`/api/users/${result.id}`).json(result);
  }).catch(err => {
    if (err.code === 11000) {
      err = new Error('The username already exists');
      err.status = 400;
    }
    next(err);
  });
});

module.exports = router;