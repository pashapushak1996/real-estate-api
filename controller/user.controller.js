const jwt = require('jsonwebtoken');
const { User } = require('../model');
const { passwordService, emailService } = require('../service');
const { userNormalizator } = require('../util/user.utils');
const { statusCodes, emailActions, variables } = require('../config');

const userController = {
    create: async (req, res, next) => {
        try {
            const { password } = req.body;

            const hashedPassword = await passwordService.hash(password);

            const confirmationCode = jwt.sign({}, variables.CONFIRM_SECRET_KEY, { expiresIn: '1d' });

            const userDocument = await User.create({ ...req.body, password: hashedPassword, confirmationCode });

            const userObject = userDocument.toObject();

            const normalizedUser = userNormalizator(userObject);

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
