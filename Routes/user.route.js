const express = require("express");
const route = express.Router();
const authentication = require("../Middleware/Authentication");
const authorization = require("../Middleware/Authorization");
const userController = require("../Controllers/user.controller");

route.get("/users", userController.getAllUsers);

route.get("/users/:id", userController.getUserById);

route.post("/users",userController.createUser);

route.patch("/users/:id", userController.updateUserInforById);

route.delete("/users/:id", authentication, authorization, userController.deleteUserById);

route.patch("/users/:id/password", userController.changePasswordById);

module.exports = route;



