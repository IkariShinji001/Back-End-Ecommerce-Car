const express = require("express");
const route = express.Router();
const authentication = require("../Middleware/Authentication");
const authorization = require("../Middleware/Authorization");
const userController = require("../Controllers/user.controller");

route.get("/users",authentication, authorization, userController.getAllUser);

route.get("/users/:id", userController.getOneUser);

route.post("/users/login", userController.login);

route.get("/users/verify", userController.verify);

route.post("/users/create",userController.createUser);

route.delete("/users/delete/:id", authentication, authorization, userController.deleteUser);


module.exports = route;



