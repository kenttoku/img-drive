const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = 8080;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('./public'));

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Server up on PORT ${PORT}`));
