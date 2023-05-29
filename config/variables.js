const variables = {
    PORT: process.env.PORT || 5001,

    ACCESS_SECRET_KEY: process.env.ACCESS_SECRET_KEY || 'access',
    REFRESH_SECRET_KEY: process.env.REFRESH_SECRET_KEY || 'refresh',
    CONFIRM_SECRET_KEY: process.env.CONFIRM_SECRET_KEY || 'confirm',
    FORGOT_SECRET_KEY: process.env.FORGOT_SECRET_KEY || 'forgot',

    MAIL_USERNAME: process.env.MAIL_USERNAME || 'example@gmail.com',
    MAIL_PASSWORD: process.env.MAIL_PASSWORD || 'h1234',

    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173/',
    API_URL: process.env.API_URL || 'http://localhost:5001',
};

module.exports = variables;
