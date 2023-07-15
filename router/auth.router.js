const router = require('express').Router();

const { authController } = require('../controller');
const { userMiddleware, authMiddleware } = require('../middleware');
const { userValidator } = require('../validators');

router.post(
    '/',
    userMiddleware.getUserByDynamicParams('email'),
    userMiddleware.isUserExist(false),
    // userMiddleware.checkUserStatus,
    authController.login,
);

router.post(
    '/password/forgot',
    userMiddleware.getUserByDynamicParams('email'),
    userMiddleware.isUserExist(false),
    authController.forgotPassword,
);

router.patch(
    '/password/reset/:action_token',
    userMiddleware.validateUserBody(userValidator.updatePassword),
    authController.resetPassword,
);

router.get(
    '/confirm/:confirmationCode',
    authController.verify,
);

router.post(
    '/confirm/sendConfirmation',
    userMiddleware.getUserByDynamicParams('email'),
    userMiddleware.isUserExist(false),
    authController.sendConfirmation,
);

router.post(
    '/logout',
    authMiddleware.checkAccessToken,
    authController.logout,
);

router.post(
    '/refresh',
    authMiddleware.checkRefreshToken,
    authController.refresh,
);

module.exports = router;
