const jwt = require('jsonwebtoken');
const { User, EmailConfirmation } = require('../model');
const { passwordService, emailService } = require('../service');
const { userNormalizator } = require('../util/user.utils');
const { statusCodes, emailActions, variables } = require('../config');

const userController = {
    create: async (req, res, next) => {
        try {
            const { password } = req.body;

            const hashedPassword = await passwordService.hash(password);

            const confirmationCode = jwt.sign({}, variables.CONFIRM_SECRET_KEY, { expiresIn: '5d' });

            const userDocument = await User.create({ ...req.body, password: hashedPassword, confirmationCode });

            const userObject = userDocument.toObject();

            const normalizedUser = userNormalizator(userObject);

            await EmailConfirmation.create({ confirmationCode, user: normalizedUser._id });

            await emailService
                .sendActivationEmail(
                    userObject.email,
                    emailActions.WELCOME,
                    {
                        username: userObject.name,
                        confirmationCode,
                    },
                );

            res.status(statusCodes.CREATED).json(normalizedUser);
        } catch (e) {
            next(e);
        }
    },

    update: async (req, res, next) => {
        try {
            const { loggedUser, body } = req;

            const user = await User.findByIdAndUpdate(
                loggedUser._id,
                { ...loggedUser, ...body },
                { new: true },
            );

            const normalizedUser = userNormalizator(user.toObject());

            res.json(normalizedUser);
        } catch (e) {
            next(e);
        }
    },

    resendConfirmation: async (req, res, next) => {
        try {
            const { user } = req;

            await EmailConfirmation.updateMany({ user: user._id }, { expired: true });

            const confirmationCode = await jwt.sign(
                {},
                variables.CONFIRM_SECRET_KEY,
                { expiresIn: '5d' },
            );

            await EmailConfirmation.create({ confirmationCode, user: user._id });

            await emailService.sendActivationEmail(
                user.email,
                emailActions.WELCOME,
                {
                    username: user.name,
                    confirmationCode,
                },
            );

            const userObject = user.toJSON();

            res.json({ ...userNormalizator(userObject) });
        } catch (e) {
            next(e);
        }
    },

    delete: async (req, res, next) => {
        try {
            const { user } = req;

            await User.deleteOne({ _id: user._id });

            res.status(statusCodes.NO_CONTENT).end();
        } catch (e) {
            next(e);
        }
    },
};

module.exports = userController;
