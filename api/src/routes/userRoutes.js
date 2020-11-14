const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/user', userController.userAccounts);

router.post('/cadastro', userController.signin);
router.post('/login', userController.login);
router.post('/user/change-password', userController.changePassword);
router.post('/user/info', userController.userInfo);
router.post('/logout', userController.logout);
router.post('/verification', userController.emailVerification);
router.post('/reverification', userController.reverification);
router.post('/forgot-password', userController.forgotPassword);
router.post('/confirm-password', userController.confirmPassword);

router.put('/user/account', userController.saveAccount);

module.exports = router;