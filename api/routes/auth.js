const express = require('express');
const AuthController = require('../controllers/authController');

const router = express.Router();
const authController = new AuthController();

router.post('/register', (req, res, next) => authController.register(req, res, next))

router.post('/login', (req, res, next) => authController.login(req, res, next));

router.post('/forgotPassword', (req, res, next) => authController.forgotPassword(req, res, next));

router.post('/resetPassword', (req, res, next) => authController.resetPassword(req, res, next));


module.exports = router;