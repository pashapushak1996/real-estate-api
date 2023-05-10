const express = require('express');

const { PORT } = require('./config');
const { authRouter } = require('./router');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`App is listened on ${ PORT } port`);
});

app.use('/auth', authRouter);
