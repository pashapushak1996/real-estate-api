const nodemailer = require('nodemailer');
const path = require('path');
const EmailTemplate = require('email-templates');
const templates = require('../email-template');

const templateParser = new EmailTemplate({
    views: {
        root: path.join(process.cwd(), 'email-template'),
    },
});

const { variables, statusCodes } = require('../config');
const { ErrorHandler, errorMessageEnum } = require('../error');

const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: variables.MAIL_USERNAME,
        pass: variables.MAIL_PASSWORD,
    },
});

const emailService = {
    sendEmail: async (userMail, emailAction, context = {}) => {
        const templateInfo = templates[emailAction];

        if (!templateInfo) {
            throw new ErrorHandler(statusCodes.SERVER_ERROR, errorMessageEnum.TEMPLATE_NOT_FOUND);
        }

        const { templateName, subject } = templateInfo;

        context.FRONTEND_URL = variables.FRONTEND_URL;

        const html = await templateParser.render(templateName, context);

        return transport.sendMail({
            from: 'No reply',
            to: userMail,
            subject,
            html,
        });
    },
};

module.exports = emailService;
