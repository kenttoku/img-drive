const express = require('express');
const morgan = require('morgan');

const { PORT } = require('./config');
const db = require('./db');
const imageRouter = require('./routers/image-router');

// Create an Express app
const app = express();

// Log all requests
app.use(morgan('dev'));

// Create a static web server
app.use(express.static('public'));

// Parse request body
app.use(express.json());

// Mount routers
app.use('/api/images', imageRouter);

// Listen for incoming connections
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server up on PORT ${PORT}`);

  db
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
});
