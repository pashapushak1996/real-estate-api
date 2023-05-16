const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

// There will be a ternary expression which depends on mode(dev or prod)

const DB_URL = process.env.MONGODB_URL;

const initDatabase = async () => {
    await mongoose.connect(
        DB_URL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    );
};

module.exports = initDatabase;
