const router = require('express').Router();

const { userController } = require('../controller');

router.post('/', userController.create);

router.put('/:userId', userController.update);

router.delete('/:userId', userController.delete);

module.exports = router;
