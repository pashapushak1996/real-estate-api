const router = require('express').Router();

const { authController } = require('../controller');
const { userMiddleware, authMiddleware } = require('../middleware');

router.post(
    '/',
    userMiddleware.getUserByDynamicParams('email'),
    userMiddleware.isUserExist(false),
    userMiddleware.checkUserStatus,
    authController.login,
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
