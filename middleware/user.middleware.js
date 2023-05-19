const { ErrorHandler } = require('../error');
const { statusCodes } = require('../constants');
const { User } = require('../model');

const userMiddleware = {
    validateUserBody: (validator) => (req, res, next) => {
        try {
            const { error } = validator.validate(req.body);

            if (error) {
                throw new ErrorHandler(statusCodes.BAD_REQUEST, error.details[0].message);
            }

            next();
        } catch (e) {
            next(e);
        }
    },
    isUserExist: (throwError) => (req, res, next) => {
        try {
            const { user } = req;

            if (user && throwError) {
                throw new ErrorHandler(statusCodes.NOT_FOUND, 'User is already exist');
            }

            if (!user && !throwError) {
                throw new ErrorHandler(statusCodes.NOT_FOUND, 'User not found');
            }

            next();
        } catch (e) {
            next(e);
        }
    },
    getUserByDynamicParams: (searchBy, searchIn = 'body', dbField = searchBy) => async (req, res, next) => {
        try {
            const value = req[searchIn][searchBy];

            const user = await User.findOne({ [dbField]: value });

            req.user = user;

            next();
        } catch (e) {
            next(e);
        }
    },
};

module.exports = userMiddleware;
