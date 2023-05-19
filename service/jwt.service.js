const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// It allows to get rid of callback
const verify = promisify(jwt.verify);

const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = require('../config');
const { statusCodes } = require('../constants');
const { ErrorHandler } = require('../error');

const jwtService = {
    generateTokenPair: () => {
        const access_token = jwt.sign({}, 'access', { expiresIn: '15m' });
        const refresh_token = jwt.sign({}, 'refresh', { expiresIn: '31d' });

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
            throw new ErrorHandler(statusCodes.UNAUTHORIZED, 'Invalid token');
        }
    },
};

module.exports = jwtService;
