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

            await OAuth.create({ ...tokenPair, user });

            res.status(statusCodes.CREATED)
                .json({ ...tokenPair, user: userNormalizator(user.toJSON()) });
        } catch (e) {
            next(e);
        }
    },
};

module.exports = authController;
