const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/cadastro', userController.signin);
router.post('/login', userController.login);
router.post('/change-password', userController.changePassword);

router.put('/account', userController.saveAccount);

module.exports = router;