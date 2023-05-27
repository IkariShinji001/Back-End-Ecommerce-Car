const express = require("express");
const route = express.Router();
const transactionController = require("../Controllers/transaction.controller");

route.get("/deposit", transactionController.getAllDeposit);


module.exports = route;