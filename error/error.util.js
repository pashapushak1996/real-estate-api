const { statusCodes } = require('../config');
const errorMessages = require('./error-message.enum');

function _notFoundErrorHandler(err, req, res, next) {
    next({
        status: err.status || statusCodes.NOT_FOUND,
        message: err.message || errorMessages.NOT_FOUND_ERR,
    });
}

// eslint-disable-next-line no-unused-vars
function _mainErrorHandler(err, req, res, next) {
    res
        .status(err.status || statusCodes.SERVER_ERROR)
        .json({
            message: err.message || errorMessages.INTERNAL_SERVER_ERROR,
        });
}

module.exports = {
    _mainErrorHandler,
    _notFoundErrorHandler,
};
