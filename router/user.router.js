const router = require('express').Router();

const { userController } = require('../controller');
const { userMiddleware, authMiddleware } = require('../middleware');
const { userValidator } = require('../validators');

router.post(
    '/',
    userMiddleware.validateUserBody(userValidator.createUser),
    userMiddleware.getUserByDynamicParams('email'),
    userMiddleware.isUserExist(true),
    userController.create,
);

router.get(
    '/:user_id/resendConfirmation',
    userMiddleware.getUserByDynamicParams('user_id', 'params', '_id'),
    userMiddleware.isUserExist(false),
    userController.resendConfirmation,
);

router.put(
    '/:user_id',
    userMiddleware.validateUserBody(userValidator.updateUser),
    authMiddleware.checkAccessToken,
    userMiddleware.getUserByDynamicParams('user_id', 'params', '_id'),
    userMiddleware.isUserExist(false),
    userController.update,
);

router.delete(
    '/:user_id',
    authMiddleware.checkAccessToken,
    userMiddleware.getUserByDynamicParams('user_id', 'params', '_id'),
    userMiddleware.isUserExist(false),
    userController.delete,
);

module.exports = router;
