const { passwordService, jwtService } = require('../service');
const { OAuth } = require('../model');
const { userNormalizator } = require('../util/user.utils');
const { statusCodes } = require('../constants');

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
            const { user } = req;

            await OAuth.deleteOne({ user: user._id });

            const tokenPair = jwtService.generateTokenPair();

            await OAuth.create({ ...tokenPair, user: user._id });

            res.json({
                ...tokenPair,
                user: userNormalizator(user.toJSON()),
            });
        } catch (e) {
            next(e);
        }
    },
};

module.exports = authController;
