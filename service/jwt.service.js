const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// It allows to get rid of callback
const verify = promisify(jwt.verify);

const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = require('../config');
const { statusCodes } = require('../config');
const { ErrorHandler, errorMessageEnum } = require('../error');

const jwtService = {
    generateTokenPair: () => {
        const access_token = jwt.sign({}, ACCESS_SECRET_KEY, { expiresIn: '15m' });
        const refresh_token = jwt.sign({}, REFRESH_SECRET_KEY, { expiresIn: '31d' });

        return {
            access_token,
            refresh_token,
        };
    },
    verifyToken: async (token, tokenType = 'access') => {
        try {
            const secretWord = tokenType === 'access'
                ? ACCESS_SECRET_KEY
                : REFRESH_SECRET_KEY;

            await verify(token, secretWord);
        } catch (e) {
            throw new ErrorHandler(statusCodes.UNAUTHORIZED, errorMessageEnum.WRONG_TOKEN);
        }
    },
    verifyActionToken: async (token, secretWord) => {
        try {
            await verify(token, secretWord);
        } catch (e) {
            throw new ErrorHandler(statusCodes.UNAUTHORIZED, errorMessageEnum.WRONG_TOKEN);
        }
    },
};

module.exports = jwtService;
