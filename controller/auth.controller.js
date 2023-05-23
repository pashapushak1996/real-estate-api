const { passwordService, jwtService } = require('../service');
const { OAuth, User } = require('../model');
const { userNormalizator } = require('../util/user.utils');
const { statusCodes, constants, userStatuses } = require('../config');
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

            const userDocument = await User.findOneAndUpdate(
                { confirmationCode },
                { status: userStatuses.ACTIVE },
                { new: true },
            );

            if (!userDocument) {
                throw new ErrorHandler(statusCodes.NOT_FOUND, errorMessageEnum, 'User not found');
            }

            const userObject = userDocument.toJSON();

            res.json({ ...userObject });
        } catch (e) {
            next(e);
        }
    },
};

module.exports = authController;
