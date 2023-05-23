const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

require('dotenv').config();

const { errorUtils } = require('./error');

const { dbInit } = require('./util');

const { variables } = require('./config');
const apiRouter = require('./router');

const app = express();

// Main config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('tiny'));

app.listen(variables.PORT, () => {
    console.log(`App is listened on ${ variables.PORT } port`);
});

// database initialization
dbInit();

// Router
app.use('/', apiRouter);
app.use('*', errorUtils._notFoundErrorHandler);
app.use(errorUtils._mainErrorHandler);
