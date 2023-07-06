const express = require("express");
const route = express.Router();
const authentication = require("../Middleware/Authentication");
const authorization = require("../Middleware/Authorization");
const salesController = require("../Controllers/sales.controller");


route.get("/sales/user/:id", authentication, salesController.getUserPurchasedCars);

route.get("/sales/cars", authentication, authorization, salesController.getAllCarSold);

route.get("/sales/total-sale",  authentication, authorization, salesController.getTotalSale);

route.get("/sales/profit-by-month", authentication, authorization, salesController.getProfitByMonth);

route.get("/sales/car-sold-by-month", authentication, authorization, salesController.getCarsSoldByMonth);

route.get("/sales/cars/total", authentication, authorization, salesController.getTotalEachCarSold);

route.get("/sales/total", authentication, authorization, salesController.getTotalCarSold);

route.post("/sales", authentication, authorization, salesController.createSale);

route.put("/sales/:id", authentication, authorization, salesController.updateSale);

route.delete("/sales/:id", authentication, authorization, salesController.deleteSale);


module.exports = route;
