const router = require('express').Router();

const { userController } = require('../controller');
const { userMiddleware } = require('../middleware');
const { userValidator } = require('../validators');

router.post(
    '/',
    userMiddleware.validateUserBody(userValidator.createUser),
    userMiddleware.getUserByDynamicParams('email'),
    userMiddleware.isUserExist(true),
    userController.create,
);

router.put(
    '/:userId',
    userMiddleware.validateUserBody(userValidator.updateUser),
    userMiddleware.getUserByDynamicParams('email'),
    userMiddleware.isUserExist(false),
    userController.update,
);

router.delete(
    '/:userId',
    userMiddleware.getUserByDynamicParams('email'),
    userMiddleware.isUserExist(false),
    userController.delete,
);

module.exports = router;
