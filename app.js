const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { errorUtils } = require('./error');

require('dotenv').config();

const { dbInit } = require('./util');

const { PORT } = require('./config');
const apiRouter = require('./router');

const app = express();

// Main config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('tiny'));

app.listen(PORT, () => {
    console.log(`App is listened on ${ PORT } port`);
});

// database initialization
dbInit();

// Routes
app.use('/', apiRouter);
app.use('*', errorUtils._notFoundErrorHandler);
app.use(errorUtils._mainErrorHandler);
