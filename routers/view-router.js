const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index.njk');
});

router.get('/signup', (req, res) => {
  res.render('signup.njk');
});

router.get('/login', (req, res) => {
  res.render('login.njk');
});

module.exports = router;
