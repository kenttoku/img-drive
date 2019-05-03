const express = require('express');
const morgan = require('morgan');

const { PORT } = require('./config');

// Create an Express app
const app = express();

// Log all requests
app.use(morgan('dev'));

// Create a static web server
app.use(express.static('public'));

// Parse request body
app.use(express.json());

// Listen for incoming connections
// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Server up on PORT ${PORT}`));
