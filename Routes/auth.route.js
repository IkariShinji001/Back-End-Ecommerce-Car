const express = require("express");
const route = express.Router();
const authController = require("../Controllers/auth.controller");

route.post("/auth/login", authController.login);

route.get("/auth/verify", authController.verify);

route.post("/auth/forgot-password", authController.forgotPassword);

route.post("/auth/reset-password", authController.resetPassword);

module.exports = route;