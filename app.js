const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');

require('dotenv').config();

const { errorUtils } = require('./error');

const { dbInit } = require('./util');

const { variables } = require('./config');
const apiRouter = require('./router');
const swaggerJson = require('./docs/swagger.json');

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
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJson));
app.use('/', apiRouter);
app.use('*', errorUtils._notFoundErrorHandler);
app.use(errorUtils._mainErrorHandler);
