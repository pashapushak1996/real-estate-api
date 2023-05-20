const { ErrorHandler, errorMessageEnum } = require('../error');
const { statusCodes } = require('../constants');
const { jwtService } = require('../service');
const { OAuth } = require('../model');

const authMiddleware = {
    checkAccessToken: async (req, res, next) => {
        try {
            const access_token = req.headers.authorization;

            if (!access_token) {
                throw new ErrorHandler(statusCodes.UNAUTHORIZED, errorMessageEnum.NO_TOKEN);
            }

            await jwtService.verifyToken(access_token);

            const tokenFromDB = await OAuth.findOne({ access_token });

            if (!tokenFromDB) {
                throw new ErrorHandler(statusCodes.UNAUTHORIZED, errorMessageEnum.WRONG_TOKEN);
            }

            req.loggedUser = tokenFromDB.user;

            next();
        } catch (e) {
            next(e);
        }
    },
};

module.exports = authMiddleware;
