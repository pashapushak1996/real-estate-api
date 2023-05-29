const { emailActions } = require('../config');

module.exports = {
    [emailActions.WELCOME]: {
        templateName: 'welcome',
        subject: 'Please confirm your account',
    },
    [emailActions.FORGOT_PASSWORD]: {
        templateName: 'forgot-password',
        subject: 'Forgot password',
    },
};
