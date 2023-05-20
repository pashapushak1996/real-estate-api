const router = require('express').Router();

const { authController } = require('../controller');
const { userMiddleware } = require('../middleware');

router.post(
    '/',
    userMiddleware.getUserByDynamicParams('email'),
    userMiddleware.isUserExist(false),
    authController.login,
);

module.exports = router;
