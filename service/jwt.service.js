const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// It allows to get rid of callback
const verify = promisify(jwt.verify);

const { variables } = require('../config');
const { statusCodes } = require('../config');
const { ErrorHandler, errorMessageEnum } = require('../error');

const jwtService = {
    generateTokenPair: () => {
        const access_token = jwt.sign({}, variables.ACCESS_SECRET_KEY, { expiresIn: '15m' });
        const refresh_token = jwt.sign({}, variables.REFRESH_SECRET_KEY, { expiresIn: '31d' });

        return {
            access_token,
            refresh_token,
        };
    },
    verifyToken: async (token, tokenType = 'access') => {
        try {
            const secretWord = tokenType === 'access'
                ? variables.ACCESS_SECRET_KEY
                : variables.REFRESH_SECRET_KEY;

            await verify(token, secretWord);
        } catch (e) {
            throw new ErrorHandler(statusCodes.UNAUTHORIZED, errorMessageEnum.WRONG_TOKEN);
        }
    },
    generateActionToken: (secretWord, expiresIn, payload = {}) => {
        return jwt.sign(payload, secretWord, { expiresIn });
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
