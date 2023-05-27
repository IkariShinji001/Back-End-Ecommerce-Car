const express = require("express");
const route = express.Router();
const userController = require("../Controllers/user.controller") 

route.post("/login", userController.login);

route.post("/register", userController.)


module.exports = route;



