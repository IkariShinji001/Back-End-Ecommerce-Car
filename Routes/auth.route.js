const express = require('express');
const route = express.Router();
const authController = require('../Controllers/auth.controller');

route.post('/auth/login', authController.login);

route.post('/auth/logout', authController.logout);

route.post('/auth/verify/access-token', authController.verifyAccessToken);

route.post('/auth/refresh-token', authController.verifyRefreshToken);

route.get('/auth/verify-token-mail', authController.verifyTokenMail);

route.post('/auth/forgot-password', authController.forgotPassword);

route.post('/auth/reset-password', authController.resetPassword);

module.exports = route;
