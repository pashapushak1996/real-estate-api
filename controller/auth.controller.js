const jwt = require('jsonwebtoken');

const {
    passwordService,
    jwtService,
    emailService
} = require('../service');

const {
    OAuth,
    User,
    EmailConfirmation,
    ForgotPassword,
} = require('../model');

const { userNormalizator } = require('../util/user.utils');

const {
    statusCodes,
    constants,
    userStatuses,
    variables, emailActions,
} = require('../config');

const { ErrorHandler, errorMessageEnum } = require('../error');

const authController = {
    login: async (req, res, next) => {
        try {
            const { user, body: { password } } = req;

            await passwordService.compare(password, user.password);

            const tokenPair = jwtService.generateTokenPair();

            await OAuth.create({ ...tokenPair, user: user._id });

            res.status(statusCodes.CREATED)
                .json({ ...tokenPair, user: userNormalizator(user.toJSON()) });
        } catch (e) {
            next(e);
        }
    },

    logout: async (req, res, next) => {
        try {
            const user = req.loggedUser;

            await OAuth.deleteOne({ user: user._id });

            res.json('OK');
        } catch (e) {
            next(e);
        }
    },

    refresh: async (req, res, next) => {
        try {
            const refresh_token = req.get(constants.Authorization);

            const { user } = req;

            await OAuth.deleteOne({ refresh_token });

            const tokenPair = jwtService.generateTokenPair();

            await OAuth.create({ ...tokenPair, user: user._id });

            res.status(statusCodes.CREATED).json({ ...tokenPair, user });
        } catch (e) {
            next(e);
        }
    },

    verify: async (req, res, next) => {
        try {
            const { confirmationCode } = req.params;

            if (!confirmationCode) {
                throw new ErrorHandler(statusCodes.NOT_FOUND, errorMessageEnum.NOT_FOUND_ERR);
            }

            const tokenFromDB = await EmailConfirmation.findOne({ confirmationCode }).populate('user');

            if (!tokenFromDB) {
                throw new ErrorHandler(statusCodes.NOT_FOUND, errorMessageEnum.NOT_FOUND_ERR);
            }

            if (tokenFromDB.expired) {
                throw new ErrorHandler(statusCodes.UNAUTHORIZED, 'Confirmation code is expired');
            }

            await jwtService.verifyActionToken(confirmationCode, variables.CONFIRM_SECRET_KEY);

            const userId = tokenFromDB.user._id;

            const userDocument = await User.findByIdAndUpdate(
                userId,
                { $set: { status: userStatuses.ACTIVE } },
                { new: true },
            );

            if (!userDocument) {
                throw new ErrorHandler(statusCodes.NOT_FOUND, 'User not found');
            }

            const userObject = userDocument.toJSON();

            res.json(userNormalizator(userObject));
        } catch (e) {
            next(e);
        }
    },

    sendConfirmation: async (req, res, next) => {
        try {
            const { user } = req;

            await EmailConfirmation.updateMany({ user: user._id }, { expired: true });

            const confirmationCode = await jwt.sign(
                {},
                variables.CONFIRM_SECRET_KEY,
                { expiresIn: '1d' },
            );

            await EmailConfirmation.create({ confirmationCode, user: user._id });

            await emailService.sendEmail(
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

    forgotPassword: async (req, res, next) => {
        try {
            const { user } = req;

            const action_token = await jwtService.generateActionToken(variables.FORGOT_SECRET_KEY, '10m');

            await emailService.sendEmail(
                user.email,
                emailActions.FORGOT_PASSWORD,
                { username: user.name, action_token },
            );

            await ForgotPassword.create({ action_token, user: user._id });

            res.status(statusCodes.CREATED);
        } catch (e) {
            next(e);
        }
    },
    resetPassword: async (req, res, next) => {
        try {
            const { body: { password }, params: { action_token } } = req;

            if (!action_token) {
                throw new ErrorHandler(statusCodes.UNAUTHORIZED, errorMessageEnum.NO_TOKEN);
            }

            await jwtService.verifyActionToken(action_token, variables.FORGOT_SECRET_KEY);

            const tokenFromDB = await ForgotPassword.findOne({ action_token }).populate('user');

            if (!tokenFromDB) {
                throw new ErrorHandler(statusCodes.UNAUTHORIZED, errorMessageEnum.WRONG_TOKEN);
            }

            const hashedPassword = await passwordService.hash(password);

            const userId = tokenFromDB.user._id;

            await User.findByIdAndUpdate(userId, { password: hashedPassword });

            await OAuth.deleteMany({ user: userId });

            res.status(statusCodes.OK).end();
        } catch (e) {
            next(e);
        }
    },
};

module.exports = authController;
