/* eslint-disable no-console */
const express = require('express');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const passport = require('passport');

const { PORT } = require('./config');
const db = require('./db');
const jwtStrategy = require('./passport/jwt-strategy');
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
passport.use(jwtStrategy);

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

// Error handling
// Custom 404 Not Found route handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Custom Error Handler
app.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
  next();
});

// Listen for incoming connections
app.listen(PORT, () => {
  console.log(`Server up on PORT ${PORT}`);

  db.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));
});
