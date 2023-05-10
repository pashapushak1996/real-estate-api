const router = require('express').Router();

const { authController } = require('../controller');

router.get('/', authController.login);

module.exports = router;
