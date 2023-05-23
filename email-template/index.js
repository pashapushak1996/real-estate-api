const { emailActions } = require('../config');

module.exports = {
    [emailActions.WELCOME]: {
        templateName: 'welcome',
        subject: 'Please confirm your account',
    },
};
