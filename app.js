/* eslint-disable no-console */
const express = require('express');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const passport = require('passport');

const { PORT } = require('./config');
const db = require('./db');
const localStrategy = require('./passport/local-strategy');

// Routers
const authRouter = require('./routers/auth-router');
const imageRouter = require('./routers/image-router');
const userRouter = require('./routers/user-router');
const viewRouter = require('./routers/view-router');

// Create an Express app
const app = express();

// Configure Nunjucks
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

// Set up Passport
passport.use(localStrategy);

// Log all requests
app.use(morgan('dev'));

// Create a static web server
app.use(express.static('public'));

// Parse request body
app.use(express.json());

// Mount routers
app.use('/api/auth', authRouter);
app.use('/api/images', imageRouter);
app.use('/api/users', userRouter);
app.use('/', viewRouter);

// Listen for incoming connections
app.listen(PORT, () => {
  console.log(`Server up on PORT ${PORT}`);

  db.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));
});
