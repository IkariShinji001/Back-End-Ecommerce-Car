const express = require("express");
const route = express.Router();
const authentication = require("../Middleware/Authentication");
const authorization = require("../Middleware/Authorization");
const userController = require("../Controllers/user.controller");


route.get("/user", userController.getAllUsers);

route.post("/user/login", userController.login);

route.get("/user/verify", userController.verify);

route.post("/user/create",userController.createUser);

route.delete("/user/delete", authentication, authorization, userController.deleteUser);


module.exports = route;



