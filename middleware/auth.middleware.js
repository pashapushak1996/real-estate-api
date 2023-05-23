const { ErrorHandler, errorMessageEnum } = require('../error');
const { jwtService } = require('../service');
const { OAuth } = require('../model');
const { constants, statusCodes } = require('../config');

const authMiddleware = {
    checkAccessToken: async (req, res, next) => {
        try {
            const access_token = req.get(constants.Authorization);

            if (!access_token) {
                throw new ErrorHandler(statusCodes.UNAUTHORIZED, errorMessageEnum.NO_TOKEN);
            }

            await jwtService.verifyToken(access_token);

            const tokenFromDB = await OAuth.findOne({ access_token }).populate('user');

            if (!tokenFromDB) {
                throw new ErrorHandler(statusCodes.UNAUTHORIZED, errorMessageEnum.WRONG_TOKEN);
            }

            req.loggedUser = tokenFromDB.user;

            next();
        } catch (e) {
            next(e);
        }
    },
    checkRefreshToken: async (req, res, next) => {
        try {
            const refresh_token = req.get('authorization');

            if (!refresh_token) {
                throw new ErrorHandler(statusCodes.UNAUTHORIZED, errorMessageEnum.NO_TOKEN);
            }

            await jwtService.verifyToken(refresh_token, 'refresh');

            const tokenFromDB = await OAuth.findOne({ refresh_token }).populate('user');

            if (!tokenFromDB) {
                throw new ErrorHandler(statusCodes.UNAUTHORIZED, errorMessageEnum.WRONG_TOKEN);
            }

            req.user = tokenFromDB.user;

            next();
        } catch (e) {
            next(e);
        }
    },

};

module.exports = authMiddleware;
